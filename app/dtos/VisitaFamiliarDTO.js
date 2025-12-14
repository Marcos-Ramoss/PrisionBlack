class VisitaFamiliarDTO {
  constructor(dados) {
    this.id = dados.id || dados._id?.toString();
    this.detentoId = dados.detentoId || dados.detento?.toString();
    this.detentoNome = dados.detentoNome || dados.detento?.nome;
    this.nomeFamiliar = dados.nomeFamiliar;
    this.relacao = dados.relacao;
    this.dataVisita = dados.dataVisita;
    this.horaVisita = dados.horaVisita;
    this.observacoes = dados.observacoes || '';
  }

  static criarVazio() {
    return new VisitaFamiliarDTO({
      detentoId: null,
      nomeFamiliar: '',
      relacao: '',
      dataVisita: null,
      horaVisita: '',
      observacoes: ''
    });
  }
}

module.exports = VisitaFamiliarDTO;

