class DetentoDTO {
  constructor(dados) {
    this.id = dados.id || dados._id?.toString();
    this.nome = dados.nome;
    this.idade = dados.idade;
    this.filiacao = dados.filiacao;
    this.estadoCivil = dados.estadoCivil;
    this.foto = dados.foto;
    this.reincidencia = dados.reincidencia || false;
    this.crimes = dados.crimes || [];
    this.celaId = dados.celaId || dados.cela?.toString();
    this.celaCodigo = dados.celaCodigo;
    this.celaPavilhao = dados.celaPavilhao;
    this.saida = dados.saida;
    this.registradoPor = dados.registradoPor;
    this.usuarioCadastro = dados.usuarioCadastro;
    this.dataRegistro = dados.dataRegistro;
    this.historicoAlocacao = dados.historicoAlocacao || [];
  }

  static criarVazio() {
    return new DetentoDTO({
      nome: '',
      idade: 0,
      filiacao: '',
      estadoCivil: '',
      foto: null,
      reincidencia: false,
      crimes: []
    });
  }
}

module.exports = DetentoDTO;

