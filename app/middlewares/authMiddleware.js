const jwt = require('jsonwebtoken');
const Usuario = require('../models/UserModel');

// Middleware de autenticação
const authenticate = async (req, res, next) => {
  try {

    if (req.session.user) {
      req.usuario = req.session.user;
      return next();
    }

    // Se não estiver na sessão, verifica o token
    const token = req.cookies?.token;
    if (!token) {
      return res.redirect('/');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) {
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
    next();
  } catch (error) {
    res.redirect('/');
  }
};

// Middleware de autorização por nível de acesso
const authorize = (...allowedRoles) => {
  return (req, res, next) => {

    if (!req.usuario || !allowedRoles.includes(req.usuario.nivelAcesso)) {
      return res.status(403).send(`
        <script>
          alert("Acesso negado. Você não tem permissão para acessar esta página.");
          window.location.href = '/';
        </script>
      `);
    }

    next();
  };
};

module.exports = { authenticate, authorize };