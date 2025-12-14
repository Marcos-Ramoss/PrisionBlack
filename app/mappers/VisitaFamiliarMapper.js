const VisitaFamiliarDTO = require('../dtos/VisitaFamiliarDTO');

class VisitaFamiliarMapper {
  static paraDTO(entidade) {
    if (!entidade) return null;

    const dto = new VisitaFamiliarDTO({
      id: entidade._id?.toString(),
      detento: entidade.detento,
      detentoNome: entidade.detento?.nome,
      nomeFamiliar: entidade.nomeFamiliar,
      relacao: entidade.relacao,
      dataVisita: entidade.dataVisita,
      horaVisita: entidade.horaVisita,
      observacoes: entidade.observacoes
    });

    // Manter compatibilidade com views que esperam _id e detento como objeto
    dto._id = entidade._id;
    if (entidade.detento && typeof entidade.detento === 'object') {
      dto.detento = entidade.detento;
    }

    return dto;
  }

  static paraEntidade(dto) {
    if (!dto) return null;

    return {
      detento: dto.detentoId,
      nomeFamiliar: dto.nomeFamiliar,
      relacao: dto.relacao,
      dataVisita: dto.dataVisita,
      horaVisita: dto.horaVisita,
      observacoes: dto.observacoes
    };
  }

  static paraListaDTO(entidades) {
    if (!Array.isArray(entidades)) return [];
    return entidades.map(entidade => VisitaFamiliarMapper.paraDTO(entidade));
  }
}

module.exports = VisitaFamiliarMapper;

