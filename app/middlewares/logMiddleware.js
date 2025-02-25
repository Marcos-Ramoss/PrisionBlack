const LogService = require('../services/LogService');

function logMiddleware(req, res, next) {
  const usuario = req.session.user?.username || 'Anônimo';
  const acao = `${req.method} ${req.url}`;
  LogService.registrarLog(usuario, acao);
  next();
}

module.exports = logMiddleware;