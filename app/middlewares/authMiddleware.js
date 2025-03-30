const jwt = require('jsonwebtoken');
const Usuario = require('../models/UserModel');

// Middleware de autenticação
const authenticate = async (req, res, next) => {
  try {
    console.log('Iniciando verificação de autenticação...');
    console.log('Sessão atual:', req.session);
    console.log('Token nos cookies:', req.cookies?.token);

    // Verifica se o usuário está na sessão
    if (req.session.user) {
      console.log('Usuário encontrado na sessão:', req.session.user);
      req.usuario = req.session.user;
      return next();
    }

    // Se não estiver na sessão, verifica o token
    const token = req.cookies?.token;
    if (!token) {
      console.log('Token não encontrado nos cookies');
      return res.redirect('/');
    }

    console.log('Verificando token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);

    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) {
      console.log('Usuário não encontrado no banco de dados');
      return res.redirect('/');
    }

    // Atualiza a sessão com os dados do usuário
    req.session.user = {
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      nivelAcesso: usuario.nivelAcesso
    };

    req.usuario = usuario;
    console.log('Autenticação bem-sucedida para usuário:', usuario.email);
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.redirect('/');
  }
};

// Middleware de autorização por nível de acesso
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    console.log('Verificando autorização...');
    console.log('Nível de acesso do usuário:', req.usuario?.nivelAcesso);
    console.log('Níveis permitidos:', allowedRoles);

    if (!req.usuario || !allowedRoles.includes(req.usuario.nivelAcesso)) {
      console.log('Acesso negado: nível de acesso não permitido');
      return res.status(403).send(`
        <script>
          alert("Acesso negado. Você não tem permissão para acessar esta página.");
          window.location.href = '/';
        </script>
      `);
    }

    console.log('Autorização concedida');
    next();
  };
};

module.exports = { authenticate, authorize };