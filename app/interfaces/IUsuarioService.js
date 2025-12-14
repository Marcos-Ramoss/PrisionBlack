class IUsuarioService {
  async listarUsuarios() {
    throw new Error('Método listarUsuarios deve ser implementado');
  }

  async criarUsuario(usuarioDTO, usuarioLogado) {
    throw new Error('Método criarUsuario deve ser implementado');
  }

  async excluirUsuario(id, usuarioLogado) {
    throw new Error('Método excluirUsuario deve ser implementado');
  }
}

module.exports = IUsuarioService;

