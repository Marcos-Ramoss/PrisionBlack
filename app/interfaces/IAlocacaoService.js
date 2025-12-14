class IAlocacaoService {
  async alocarDetento(celaId, detentoId, usuarioAlocador) {
    throw new Error('Método alocarDetento deve ser implementado');
  }

  async removerDetento(celaId, detentoId) {
    throw new Error('Método removerDetento deve ser implementado');
  }

  async listarAlocacoes() {
    throw new Error('Método listarAlocacoes deve ser implementado');
  }
}

module.exports = IAlocacaoService;

