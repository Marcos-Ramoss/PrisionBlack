const AuthService = require('../services/AuthService');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



class AuthController {

  static async registrar(req, res) {
    try {
      const { nome, email, senha, codigoAdmin } = req.body;
      if (!nome || !email || !senha || !codigoAdmin) {
        req.flash('error', 'Todos os campos são obrigatórios.');
        return res.redirect('/');
      }

      if (codigoAdmin !== process.env.ADMIN_CODE) {
        req.flash('error', 'Código de administrador inválido.');
        return res.redirect('/');
      }

      const emailExistente = await UserModel.findOne({ email });
      if (emailExistente) {
        req.flash('error', 'Este email já está cadastrado no sistema.');
        return res.redirect('/');
      }

      const novoUsuario = await AuthService.criarUsuario({
        nome,
        email,
        senha,
        nivelAcesso: 'ADMIN',
        criadoPor: null
      });

      req.flash('success', 'Administrador cadastrado com sucesso! Faça login para continuar.');

      await new Promise(resolve => setTimeout(resolve, 100));

      return res.redirect('/');
    } catch (error) {
      req.flash('error', error.message || 'Erro ao registrar administrador. Tente novamente.');
      return res.redirect('/');
    }
  }

  static async login(req, res) {
    try {
      if (req.session.user) {
        return res.redirect('/home');
      }

      const { email, senha } = req.body;

      const usuario = await UserModel.findOne({ email });
      if (!usuario) {
        req.flash('error', 'Email ou senha incorretos.');
        return res.redirect('/');
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        req.flash('error', 'Email ou senha incorretos.');
        return res.redirect('/');
      }

      const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      req.session.user = {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        nivelAcesso: usuario.nivelAcesso,
      };

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, // 1 hora
      });

      req.flash('success', 'Login realizado com sucesso!');
      if (usuario.nivelAcesso === 'ADMIN') {
        return res.redirect('/admin/dashboard');
      }
      if (usuario.nivelAcesso === 'DIRETOR') {
        return res.redirect('/admin/diretor/dashboard');

      } else {
        return res.redirect('/home');
      }



    } catch (error) {
      req.flash('error', 'Erro ao realizar login. Tente novamente.');
      res.redirect('/');
    }
  }

  static async logout(req, res) {
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
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

}

module.exports = AuthController;