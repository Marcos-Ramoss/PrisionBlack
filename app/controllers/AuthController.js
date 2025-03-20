const AuthService = require('../services/AuthService');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



class AuthController {

  static async registrar(req, res) {
    try {
      const { nome, email, senha, nivelAcesso } = req.body;
      const novoUsuario = await AuthService.criarUsuario({
        nome,
        email,
        senha,
        nivelAcesso,
      });

     res.redirect('/');
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async login(req, res) {
    try {
      // Verifica se o usuário já está logado
      if (req.session.user) {
        console.log('Usuário já está logado. Redirecionando para a página inicial.');
        return res.redirect('/');
      }
  
      const { email, senha } = req.body;
  
      const usuario = await UserModel.findOne({ email });
      if (!usuario) {
        throw new Error('Email ou senha incorretos.');
      }
  
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        throw new Error('Email ou senha incorretos.');
      }
  
      const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      // Armazena os dados do usuário na sessão
      req.session.user = {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        nivelAcesso: usuario.nivelAcesso,
      };
  
      // Envia o token como um cookie HTTP-only
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, // 1 hora
      });
  
      console.log('Login realizado com sucesso. Redirecionando para a página inicial.');
      res.redirect('/');
    } catch (error) {
      console.error('Erro durante o login:', error.message);
      res.redirect('/'); // Redireciona para a página inicial em caso de erro
    }
  }

  static async logout(req, res) {
    try {
      
      console.log('Iniciando processo de logout...');     
      res.clearCookie('token');
      console.log('Cookie "token" removido.');
   
      await new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            console.error('Erro ao destruir a sessão:', err.message);
            reject(err);
          } else {
            console.log('Sessão destruída com sucesso.');
            resolve();
          }
        });
      });
  
      console.log('Redirecionando para a página inicial após o logout.');
      res.redirect('/');
    } catch (error) {
      console.error('Erro durante o logout:', error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  }

}

module.exports = AuthController;