const CelaDTO = require('../dtos/CelaDTO');

class CelaMapper {
  static paraDTO(entidade) {
    if (!entidade) return null;

    const dto = new CelaDTO({
      id: entidade._id?.toString(),
      codigo: entidade.codigo,
      pavilhao: entidade.pavilhao,
      capacidade: entidade.capacidade,
      ocupantes: entidade.ocupantes || []
    });

    // Manter compatibilidade com views que esperam _id
    dto._id = entidade._id;

    return dto;
  }

  static paraEntidade(dto) {
    if (!dto) return null;

    return {
      codigo: dto.codigo,
      pavilhao: dto.pavilhao,
      capacidade: dto.capacidade,
      ocupantes: dto.ocupantes || []
    };
  }

  static paraListaDTO(entidades) {
    if (!Array.isArray(entidades)) return [];
    return entidades.map(entidade => CelaMapper.paraDTO(entidade));
  }
}

module.exports = CelaMapper;

