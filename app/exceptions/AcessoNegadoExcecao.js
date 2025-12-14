class AcessoNegadoExcecao extends Error {
  constructor(mensagem = 'Acesso negado') {
    super(mensagem);
    this.nome = 'AcessoNegadoExcecao';
    this.statusCode = 403;
  }
}

module.exports = AcessoNegadoExcecao;

