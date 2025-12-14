class ICelaService {
  async cadastrar(celaDTO) {
    throw new Error('Método cadastrar deve ser implementado');
  }

  async listar() {
    throw new Error('Método listar deve ser implementado');
  }

  async buscarPorId(id) {
    throw new Error('Método buscarPorId deve ser implementado');
  }

  async editar(id, celaDTO) {
    throw new Error('Método editar deve ser implementado');
  }

  async excluir(id) {
    throw new Error('Método excluir deve ser implementado');
  }

  async alocar(celaId, detentoId) {
    throw new Error('Método alocar deve ser implementado');
  }

  async listarPaginado(pagina, limite, busca, pavilhao, ocupacao) {
    throw new Error('Método listarPaginado deve ser implementado');
  }
}

module.exports = ICelaService;

