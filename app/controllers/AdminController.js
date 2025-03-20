const Usuario = require('../models/UsuarioModel');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

class AdminController {
  static async dashboard(req, res) {
    try {
      const usuarios = await Usuario.find();
      res.render('admin/dashboard', { usuarios, user: req.session.user });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async cadastrarUsuario(req, res) {
    try {
      const { nome, email, senha, nivelAcesso } = req.body;
      const novoUsuario = new Usuario({ nome, email, senha, nivelAcesso });
      await novoUsuario.save();
      res.redirect('/admin/dashboard');
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
}

module.exports = AdminController;