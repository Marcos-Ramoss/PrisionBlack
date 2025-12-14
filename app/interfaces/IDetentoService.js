class IDetentoService {
  async cadastrar(detentoDTO) {
    throw new Error('Método cadastrar deve ser implementado');
  }

  async listar() {
    throw new Error('Método listar deve ser implementado');
  }

  async buscarPorId(id) {
    throw new Error('Método buscarPorId deve ser implementado');
  }

  async atualizar(id, detentoDTO) {
    throw new Error('Método atualizar deve ser implementado');
  }

  async excluir(id) {
    throw new Error('Método excluir deve ser implementado');
  }

  async pesquisarPorNome(nome) {
    throw new Error('Método pesquisarPorNome deve ser implementado');
  }

  async listarPaginado(pagina, limite, busca, pavilhao, reincidencia) {
    throw new Error('Método listarPaginado deve ser implementado');
  }
}

module.exports = IDetentoService;

