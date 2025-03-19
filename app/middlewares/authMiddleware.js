const jwt = require('jsonwebtoken');
const Usuario = require('../models/UserModel');

// Middleware de autenticação
const authenticate = async (req, res, next) => {
  const token = req.cookies?.token;

  console.log('Token recebido no middleware:', token);

  if (!token) {
    console.log('Erro: Token não fornecido.');
    return res.redirect('/'); // Redireciona para a página inicial
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token válido. Dados decodificados:', decoded);

    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) {
      console.log('Erro: Usuário não encontrado.');
      return res.redirect('/'); // Redireciona para a página inicial
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.error('Erro ao verificar o token:', error.message);
    res.redirect('/'); // Redireciona para a página inicial
  }
};

// Middleware de autorização por nível de acesso
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.usuario.nivelAcesso)) {
      console.log('Nível de acesso do usuário:', req.usuario.nivelAcesso); 
      return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };