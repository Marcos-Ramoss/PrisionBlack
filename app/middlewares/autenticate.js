function authenticate(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/'); // Redireciona para a página de login
  }
  next();
}

module.exports = authenticate;