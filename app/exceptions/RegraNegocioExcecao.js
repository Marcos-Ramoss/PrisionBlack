class RegraNegocioExcecao extends Error {
  constructor(mensagem = 'Violação de regra de negócio') {
    super(mensagem);
    this.nome = 'RegraNegocioExcecao';
    this.statusCode = 422;
  }
}

module.exports = RegraNegocioExcecao;

