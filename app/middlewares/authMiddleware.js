const authConfig = require('../config/auth');

function authMiddleware(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

module.exports = authMiddleware;