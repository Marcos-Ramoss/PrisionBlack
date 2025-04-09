const AuthService = require('../services/AuthService');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



class AuthController {

  static async registrar(req, res) {
    try {
      console.log('Iniciando processo de registro...');
      const { nome, email, senha, codigoAdmin } = req.body;
      console.log('Dados recebidos:', { nome, email, codigoAdmin, senha: senha ? 'presente' : 'ausente' });

      // Verifica se todos os campos necessários estão presentes
      if (!nome || !email || !senha || !codigoAdmin) {
        console.log('Campos obrigatórios ausentes:', { nome: !!nome, email: !!email, senha: !!senha, codigoAdmin: !!codigoAdmin });
        req.flash('error', 'Todos os campos são obrigatórios.');
        return res.redirect('/');
      }

      // Verifica se o código de admin está correto
      if (codigoAdmin !== process.env.ADMIN_CODE) {
        console.log('Código de admin inválido');
        req.flash('error', 'Código de administrador inválido.');
        return res.redirect('/');
      }

      // Verifica se o email já está cadastrado
      console.log('Verificando email existente...');
      const emailExistente = await UserModel.findOne({ email });
      if (emailExistente) {
        console.log('Email já cadastrado no sistema');
        req.flash('error', 'Este email já está cadastrado no sistema.');
        return res.redirect('/');
      }

      console.log('Criando novo usuário admin...');
      // Usa o AuthService para criar o usuário
      const novoUsuario = await AuthService.criarUsuario({
        nome,
        email,
        senha,
        nivelAcesso: 'ADMIN',
        criadoPor: null
      });

      console.log('Usuário admin criado com sucesso:', { id: novoUsuario._id, email: novoUsuario.email });
      req.flash('success', 'Administrador cadastrado com sucesso! Faça login para continuar.');
      
      // Aguarda um momento para garantir que a mensagem flash seja salva
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return res.redirect('/');
    } catch (error) {
      console.error('Erro detalhado ao registrar admin:', error);
      req.flash('error', error.message || 'Erro ao registrar administrador. Tente novamente.');
      return res.redirect('/');
    }
  }

  static async login(req, res) {
    try {
      if (req.session.user) {
        console.log('Usuário já está logado. Redirecionando para a página inicial.');
        return res.redirect('/home');
      }

      const { email, senha } = req.body;
      console.log('Tentativa de login para email:', email);

      const usuario = await UserModel.findOne({ email });
      if (!usuario) {
        console.log('Usuário não encontrado para email:', email);
        req.flash('error', 'Email ou senha incorretos.');
        return res.redirect('/');
      }

      console.log('Usuário encontrado, verificando senha...');
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      
      if (!senhaValida) {
        console.log('Senha inválida para usuário:', email);
        req.flash('error', 'Email ou senha incorretos.');
        return res.redirect('/');
      }

      console.log('Senha válida, gerando token...');
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

      console.log('Login realizado com sucesso para usuário:', email);
      req.flash('success', 'Login realizado com sucesso!');
      if (usuario.nivelAcesso === 'ADMIN') {
        return res.redirect('/admin/dashboard');  
      } 
      if (usuario.nivelAcesso === 'DIRETOR') {
        return res.redirect('/admin/diretor/dashboard');  

      }else {
        return res.redirect('/home');
      }
      
      

    } catch (error) {
      console.error('Erro durante o login:', error);
      req.flash('error', 'Erro ao realizar login. Tente novamente.');
      res.redirect('/');
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