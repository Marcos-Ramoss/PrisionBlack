class AlocacaoDTO {
  constructor(dados) {
    this.celaId = dados.celaId;
    this.detentoId = dados.detentoId;
    this.usuarioAlocador = dados.usuarioAlocador;
    this.dataAlocacao = dados.dataAlocacao || new Date();
  }
}

module.exports = AlocacaoDTO;

