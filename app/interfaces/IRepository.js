class IRepository {
  async buscarPorId(id) {
    throw new Error('Método buscarPorId deve ser implementado');
  }

  async listar() {
    throw new Error('Método listar deve ser implementado');
  }

  async criar(dados) {
    throw new Error('Método criar deve ser implementado');
  }

  async atualizar(id, dados) {
    throw new Error('Método atualizar deve ser implementado');
  }

  async excluir(id) {
    throw new Error('Método excluir deve ser implementado');
  }
}

module.exports = IRepository;

