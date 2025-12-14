const UsuarioDTO = require('../dtos/UsuarioDTO');

class UsuarioMapper {
  static paraDTO(entidade) {
    if (!entidade) return null;

    return new UsuarioDTO({
      id: entidade._id?.toString(),
      nome: entidade.nome,
      email: entidade.email,
      nivelAcesso: entidade.nivelAcesso,
      criadoPor: entidade.criadoPor,
      createdAt: entidade.createdAt
    });
  }

  static paraEntidade(dto) {
    if (!dto) return null;

    return {
      nome: dto.nome,
      email: dto.email,
      senha: dto.senha,
      nivelAcesso: dto.nivelAcesso,
      criadoPor: dto.criadoPor
    };
  }

  static paraListaDTO(entidades) {
    if (!Array.isArray(entidades)) return [];
    return entidades.map(entidade => UsuarioMapper.paraDTO(entidade));
  }

  static paraLoginDTO(entidade) {
    if (!entidade) return null;
    return UsuarioDTO.criarParaLogin(entidade);
  }
}

module.exports = UsuarioMapper;

