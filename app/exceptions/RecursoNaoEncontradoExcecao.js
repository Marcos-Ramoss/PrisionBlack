class RecursoNaoEncontradoExcecao extends Error {
  constructor(mensagem = 'Recurso não encontrado') {
    super(mensagem);
    this.nome = 'RecursoNaoEncontradoExcecao';
    this.statusCode = 404;
  }
}

module.exports = RecursoNaoEncontradoExcecao;

