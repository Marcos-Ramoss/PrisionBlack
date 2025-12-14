const VisitaAdvogadoModel = require('../models/VisitaAdvogadoModel');
const DetentoModel = require('../models/DetentoModel');
const VisitaAdvogadoMapper = require('../mappers/VisitaAdvogadoMapper');
const RecursoNaoEncontradoExcecao = require('../exceptions/RecursoNaoEncontradoExcecao');
const ValidacaoExcecao = require('../exceptions/ValidacaoExcecao');

class VisitaAdvogadoService {
  static async listar() {
    const entidades = await VisitaAdvogadoModel.find().populate('detento');
    return VisitaAdvogadoMapper.paraListaDTO(entidades);
  }

  static async buscarPorId(id) {
    const entidade = await VisitaAdvogadoModel.findById(id).populate('detento');
    
    if (!entidade) {
      throw new RecursoNaoEncontradoExcecao('Visita de advogado não encontrada');
    }
    
    return VisitaAdvogadoMapper.paraDTO(entidade);
  }

  static async cadastrar(visitaAdvogadoDTO) {
    visitaAdvogadoDTO.nomeAdvogado = VisitaAdvogadoService.normalizarNome(visitaAdvogadoDTO.nomeAdvogado);
    visitaAdvogadoDTO.numeroOAB = VisitaAdvogadoService.normalizarOAB(visitaAdvogadoDTO.numeroOAB);
    
    await VisitaAdvogadoService.validarDetentoExiste(visitaAdvogadoDTO.detentoId);
    
    const dadosEntidade = VisitaAdvogadoMapper.paraEntidade(visitaAdvogadoDTO);
    const novaVisita = new VisitaAdvogadoModel(dadosEntidade);
    const visitaSalva = await novaVisita.save();
    
    return VisitaAdvogadoMapper.paraDTO(visitaSalva);
  }

  static normalizarNome(nome) {
    if (!nome) return nome;
    return nome.trim()
      .split(/\s+/)
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
      .join(' ');
  }

  static normalizarOAB(numeroOAB) {
    if (!numeroOAB) return numeroOAB;
    const apenasNumeros = numeroOAB.replace(/\D/g, '');
    if (apenasNumeros.length !== 6) {
      throw new ValidacaoExcecao('Número OAB deve ter exatamente 6 dígitos');
    }
    return apenasNumeros;
  }

  static async validarDetentoExiste(detentoId) {
    if (!detentoId) {
      throw new ValidacaoExcecao('Detento é obrigatório');
    }
    
    const detento = await DetentoModel.findById(detentoId);
    if (!detento) {
      throw new RecursoNaoEncontradoExcecao('Detento não encontrado');
    }
  }

  static async editar(id, visitaAdvogadoDTO) {
    if (visitaAdvogadoDTO.nomeAdvogado) {
      visitaAdvogadoDTO.nomeAdvogado = VisitaAdvogadoService.normalizarNome(visitaAdvogadoDTO.nomeAdvogado);
    }
    if (visitaAdvogadoDTO.numeroOAB) {
      visitaAdvogadoDTO.numeroOAB = VisitaAdvogadoService.normalizarOAB(visitaAdvogadoDTO.numeroOAB);
    }
    
    await VisitaAdvogadoService.validarDetentoExiste(visitaAdvogadoDTO.detentoId);
    
    const dadosEntidade = VisitaAdvogadoMapper.paraEntidade(visitaAdvogadoDTO);
    const entidadeAtualizada = await VisitaAdvogadoModel.findByIdAndUpdate(
      id,
      dadosEntidade,
      { new: true }
    ).populate('detento');
    
    if (!entidadeAtualizada) {
      throw new RecursoNaoEncontradoExcecao('Visita de advogado não encontrada');
    }
    
    return VisitaAdvogadoMapper.paraDTO(entidadeAtualizada);
  }

  static async excluir(id) {
    const visita = await VisitaAdvogadoModel.findById(id);
    if (!visita) {
      throw new RecursoNaoEncontradoExcecao('Visita de advogado não encontrada');
    }
    
    await VisitaAdvogadoModel.findByIdAndDelete(id);
  }

  static async listarPaginado(pagina = 1, limite = 5, busca = '') {
    const query = VisitaAdvogadoService.construirQueryFiltros(busca);
    const [visitas, total] = await VisitaAdvogadoService.buscarVisitasPaginadas(query, pagina, limite);
    
    return VisitaAdvogadoService.formatarResultadoPaginado(visitas, total, pagina, limite);
  }

  static construirQueryFiltros(busca) {
    if (!busca) return {};

    return {
      $or: [
        { nomeAdvogado: { $regex: new RegExp(busca, 'i') } },
        { numeroOAB: { $regex: new RegExp(busca, 'i') } }
      ]
    };
  }

  static async buscarVisitasPaginadas(query, pagina, limite) {
    const skip = (pagina - 1) * limite;
    
    return await Promise.all([
      VisitaAdvogadoModel.find(query)
        .populate('detento')
        .skip(skip)
        .limit(limite),
      VisitaAdvogadoModel.countDocuments(query)
    ]);
  }

  static formatarResultadoPaginado(visitas, total, pagina, limite) {
    return {
      visitas: VisitaAdvogadoMapper.paraListaDTO(visitas),
      total,
      page: pagina,
      totalPages: Math.ceil(total / limite)
    };
  }
}

module.exports = VisitaAdvogadoService;
