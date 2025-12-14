class CelaDTO {
  constructor(dados) {
    this.id = dados.id || dados._id?.toString();
    this.codigo = dados.codigo;
    this.pavilhao = dados.pavilhao;
    this.capacidade = dados.capacidade;
    this.ocupantes = dados.ocupantes || [];
    this.quantidadeOcupantes = dados.ocupantes?.length || 0;
    this.disponibilidade = dados.capacidade - (dados.ocupantes?.length || 0);
    this.estaCheia = (dados.ocupantes?.length || 0) >= dados.capacidade;
  }

  static criarVazio() {
    return new CelaDTO({
      codigo: '',
      pavilhao: '',
      capacidade: 0,
      ocupantes: []
    });
  }
}

module.exports = CelaDTO;

