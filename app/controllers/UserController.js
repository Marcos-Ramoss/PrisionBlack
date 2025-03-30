const UserService = require('../services/UserService');

class UserController {
  static async listarUsuarios(req, res) {
    try {
      const usuarios = await UserService.listarUsuarios();
      res.render('admin/gerenciar-usuarios', { 
        usuarios,
        user: req.usuario
      });
    } catch (error) {
      console.error('Erro ao carregar usuários:', error.message);
      req.flash('error', error.message);
      res.redirect('/admin/gerenciar-usuarios');
    }
  }

  static async cadastrarUsuario(req, res) {
    try {
      const { nome, email, senha, nivelAcesso } = req.body;
      
      await UserService.criarUsuario({
        nome,
        email,
        senha,
        nivelAcesso
      }, req.usuario);

      req.flash('success', 'Usuário cadastrado com sucesso.');
      res.redirect('/admin/gerenciar-usuarios');
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error.message);
      req.flash('error', error.message);
      res.redirect('/admin/gerenciar-usuarios');
    }
  }

  static async excluirUsuario(req, res) {
    try {
      const { id } = req.params;
      console.log('Tentando excluir usuário com ID:', id);
      console.log('Usuário que está tentando excluir:', req.usuario);
      
      await UserService.excluirUsuario(id, req.usuario);
      console.log('Usuário excluído com sucesso');
      
      req.flash('success', 'Usuário excluído com sucesso.');
      res.redirect('/admin/gerenciar-usuarios');
    } catch (error) {
      console.error('Erro detalhado ao excluir usuário:', error);
      req.flash('error', error.message);
      res.redirect('/admin/gerenciar-usuarios');
    }
  }
}

module.exports = UserController; 