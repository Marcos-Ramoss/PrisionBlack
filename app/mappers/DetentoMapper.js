const DetentoDTO = require('../dtos/DetentoDTO');

class DetentoMapper {
  static paraDTO(entidade) {
    if (!entidade) return null;

    const dto = new DetentoDTO({
      id: entidade._id?.toString(),
      nome: entidade.nome,
      idade: entidade.idade,
      filiacao: entidade.filiacao,
      estadoCivil: entidade.estadoCivil,
      foto: entidade.foto,
      reincidencia: entidade.reincidencia,
      crimes: entidade.crimes || [],
      cela: entidade.cela,
      celaCodigo: entidade.cela?.codigo,
      celaPavilhao: entidade.cela?.pavilhao,
      saida: entidade.saida,
      registradoPor: entidade.registradoPor,
      usuarioCadastro: entidade.usuarioCadastro,
      dataRegistro: entidade.dataRegistro,
      historicoAlocacao: entidade.historicoAlocacao || []
    });

    // Manter compatibilidade com views que esperam _id e cela como objeto
    dto._id = entidade._id;
    if (entidade.cela && typeof entidade.cela === 'object') {
      dto.cela = entidade.cela;
    }

    return dto;
  }

  static paraEntidade(dto) {
    if (!dto) return null;

    return {
      nome: dto.nome,
      idade: dto.idade,
      filiacao: dto.filiacao,
      estadoCivil: dto.estadoCivil,
      foto: dto.foto,
      reincidencia: dto.reincidencia,
      crimes: dto.crimes,
      cela: dto.celaId,
      registradoPor: dto.registradoPor,
      usuarioCadastro: dto.usuarioCadastro,
      dataRegistro: dto.dataRegistro,
      historicoAlocacao: dto.historicoAlocacao
    };
  }

  static paraListaDTO(entidades) {
    if (!Array.isArray(entidades)) return [];
    return entidades.map(entidade => DetentoMapper.paraDTO(entidade));
  }
}

module.exports = DetentoMapper;

