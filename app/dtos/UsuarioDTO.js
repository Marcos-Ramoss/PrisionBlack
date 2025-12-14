class UsuarioDTO {
  constructor(dados) {
    this.id = dados.id || dados._id?.toString();
    this.nome = dados.nome;
    this.email = dados.email;
    this.nivelAcesso = dados.nivelAcesso;
    this.criadoPor = dados.criadoPor?.toString();
    this.createdAt = dados.createdAt;
  }

  static criarVazio() {
    return new UsuarioDTO({
      nome: '',
      email: '',
      nivelAcesso: '',
      criadoPor: null
    });
  }

  static criarParaLogin(dados) {
    return {
      id: dados._id.toString(),
      nome: dados.nome,
      email: dados.email,
      nivelAcesso: dados.nivelAcesso
    };
  }
}

module.exports = UsuarioDTO;

