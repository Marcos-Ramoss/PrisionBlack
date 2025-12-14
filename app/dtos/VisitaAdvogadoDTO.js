class VisitaAdvogadoDTO {
  constructor(dados) {
    this.id = dados.id || dados._id?.toString();
    this.detentoId = dados.detentoId || dados.detento?.toString();
    this.detentoNome = dados.detentoNome || dados.detento?.nome;
    this.nomeAdvogado = dados.nomeAdvogado;
    this.numeroOAB = dados.numeroOAB;
    this.dataVisita = dados.dataVisita;
    this.horaVisita = dados.horaVisita;
    this.observacoes = dados.observacoes || '';
  }

  static criarVazio() {
    return new VisitaAdvogadoDTO({
      detentoId: null,
      nomeAdvogado: '',
      numeroOAB: '',
      dataVisita: null,
      horaVisita: '',
      observacoes: ''
    });
  }
}

module.exports = VisitaAdvogadoDTO;

