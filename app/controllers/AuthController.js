const AuthService = require('../services/AuthService');
const UserModel = require('../models/UserModel');
const UsuarioMapper = require('../mappers/UsuarioMapper');
const UsuarioDTO = require('../dtos/UsuarioDTO');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ValidacaoExcecao = require('../exceptions/ValidacaoExcecao');
const RegraNegocioExcecao = require('../exceptions/RegraNegocioExcecao');
const AcessoNegadoExcecao = require('../exceptions/AcessoNegadoExcecao');

class AuthController {
  static async registrar(req, res, next) {
    try {
      const { nome, email, senha, codigoAdmin } = req.body;
      
      AuthController.validarCamposObrigatorios(nome, email, senha, codigoAdmin);
      AuthController.validarCodigoAdmin(codigoAdmin);
      await AuthController.validarEmailExistente(email);

      const usuarioDTO = new UsuarioDTO({
        nome,
        email,
        nivelAcesso: 'ADMIN',
        criadoPor: null
      });

      const novoUsuario = await AuthService.criarUsuario({
        ...usuarioDTO,
        senha
      });

      req.flash('success', 'Administrador cadastrado com sucesso! Faça login para continuar.');
      await new Promise(resolve => setTimeout(resolve, 100));

      return res.redirect('/');
    } catch (erro) {
      next(erro);
    }
  }

  static validarCamposObrigatorios(nome, email, senha, codigoAdmin) {
    if (!nome || !email || !senha || !codigoAdmin) {
      throw new ValidacaoExcecao('Todos os campos são obrigatórios');
    }
  }

  static validarCodigoAdmin(codigoAdmin) {
    if (codigoAdmin !== process.env.ADMIN_CODE) {
      throw new AcessoNegadoExcecao('Código de administrador inválido');
    }
  }

  static async validarEmailExistente(email) {
    const emailExistente = await UserModel.findOne({ email });
    if (emailExistente) {
      throw new RegraNegocioExcecao('Este email já está cadastrado no sistema');
    }
  }

  static async login(req, res, next) {
    try {
      if (req.session.user) {
        return res.redirect('/home');
      }

      const { email, senha } = req.body;
      const usuario = await AuthController.buscarUsuarioPorEmail(email);
      await AuthController.validarSenha(senha, usuario.senha);

      const token = AuthController.gerarToken(usuario);
      AuthController.configurarSessao(req, usuario);
      AuthController.configurarCookie(res, token);

      req.flash('success', 'Login realizado com sucesso!');
      return AuthController.redirecionarPorNivelAcesso(res, usuario.nivelAcesso);
    } catch (erro) {
      next(erro);
    }
  }

  static async buscarUsuarioPorEmail(email) {
    const usuario = await UserModel.findOne({ email });
    if (!usuario) {
      throw new AcessoNegadoExcecao('Email ou senha incorretos');
    }
    return usuario;
  }

  static async validarSenha(senha, senhaHash) {
    const senhaValida = await bcrypt.compare(senha, senhaHash);
    if (!senhaValida) {
      throw new AcessoNegadoExcecao('Email ou senha incorretos');
    }
  }

  static gerarToken(usuario) {
    return jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  }

  static configurarSessao(req, usuario) {
    req.session.user = UsuarioMapper.paraLoginDTO(usuario);
  }

  static configurarCookie(res, token) {
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000
    });
  }

  static redirecionarPorNivelAcesso(res, nivelAcesso) {
    if (nivelAcesso === 'ADMIN') {
      return res.redirect('/admin/dashboard');
    }
    if (nivelAcesso === 'DIRETOR') {
      return res.redirect('/admin/diretor/dashboard');
    }
    return res.redirect('/home');
  }

  static async logout(req, res, next) {
    try {
      res.clearCookie('token');

      await new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      res.redirect('/');
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = AuthController;
