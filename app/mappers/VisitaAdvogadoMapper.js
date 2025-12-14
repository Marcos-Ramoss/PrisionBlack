const VisitaAdvogadoDTO = require('../dtos/VisitaAdvogadoDTO');

class VisitaAdvogadoMapper {
  static paraDTO(entidade) {
    if (!entidade) return null;

    const dto = new VisitaAdvogadoDTO({
      id: entidade._id?.toString(),
      detento: entidade.detento,
      detentoNome: entidade.detento?.nome,
      nomeAdvogado: entidade.nomeAdvogado,
      numeroOAB: entidade.numeroOAB,
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
      nomeAdvogado: dto.nomeAdvogado,
      numeroOAB: dto.numeroOAB,
      dataVisita: dto.dataVisita,
      horaVisita: dto.horaVisita,
      observacoes: dto.observacoes
    };
  }

  static paraListaDTO(entidades) {
    if (!Array.isArray(entidades)) return [];
    return entidades.map(entidade => VisitaAdvogadoMapper.paraDTO(entidade));
  }
}

module.exports = VisitaAdvogadoMapper;

