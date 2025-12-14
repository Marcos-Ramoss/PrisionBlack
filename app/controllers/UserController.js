const UserService = require('../services/UserService');
const UsuarioDTO = require('../dtos/UsuarioDTO');

class UserController {
  static async listarUsuarios(req, res, next) {
    try {
      const usuarios = await UserService.listarUsuarios();
      res.render('admin/gerenciar-usuarios', {
        usuarios,
        user: req.usuario
      });
    } catch (erro) {
      next(erro);
    }
  }

  static async cadastrarUsuario(req, res, next) {
    try {
      const usuarioDTO = UserController.criarDTODoRequest(req);
      await UserService.criarUsuario(usuarioDTO, req.usuario);

      req.flash('success', 'Usuário cadastrado com sucesso.');
      res.redirect('/admin/gerenciar-usuarios');
    } catch (erro) {
      next(erro);
    }
  }

  static criarDTODoRequest(req) {
    const { nome, email, senha, nivelAcesso } = req.body;
    return new UsuarioDTO({
      nome,
      email,
      senha,
      nivelAcesso
    });
  }

  static async excluirUsuario(req, res, next) {
    try {
      const { id } = req.params;
      await UserService.excluirUsuario(id, req.usuario);

      req.flash('success', 'Usuário excluído com sucesso.');
      res.redirect('/admin/gerenciar-usuarios');
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = UserController;
