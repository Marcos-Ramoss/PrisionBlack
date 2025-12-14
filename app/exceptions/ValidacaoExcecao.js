class ValidacaoExcecao extends Error {
  constructor(mensagem = 'Dados inválidos', erros = []) {
    super(mensagem);
    this.nome = 'ValidacaoExcecao';
    this.statusCode = 400;
    this.erros = erros;
  }
}

module.exports = ValidacaoExcecao;

