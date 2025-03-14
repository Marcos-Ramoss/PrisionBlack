const AuthService = require('../services/AuthService');

class AuthController {
  static async register(req, res) {
    try {
      const { username, password } = req.body;
      await AuthService.register({ username, password });
      res.redirect('/login');
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await AuthService.login(username, password);
      req.session.user = user; // Armazena o usuário na sessão
      res.redirect('/');
    } catch (error) {
      res.status(401).send(error.message);
    }
  }

  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) return res.status(500).send('Erro ao fazer logout.');
      res.redirect('/login');
    });
  }
}

module.exports = AuthController;