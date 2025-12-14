const VisitaFamiliarModel = require('../models/VisitaFamiliarModel');
const DetentoModel = require('../models/DetentoModel');
const VisitaFamiliarMapper = require('../mappers/VisitaFamiliarMapper');
const RecursoNaoEncontradoExcecao = require('../exceptions/RecursoNaoEncontradoExcecao');
const ValidacaoExcecao = require('../exceptions/ValidacaoExcecao');

class VisitaFamiliarService {
  static async cadastrar(visitaFamiliarDTO) {
    visitaFamiliarDTO.nomeFamiliar = VisitaFamiliarService.normalizarNome(visitaFamiliarDTO.nomeFamiliar);
    visitaFamiliarDTO.relacao = VisitaFamiliarService.normalizarRelacao(visitaFamiliarDTO.relacao);
    
    await VisitaFamiliarService.validarDetentoExiste(visitaFamiliarDTO.detentoId);
    
    const dadosEntidade = VisitaFamiliarMapper.paraEntidade(visitaFamiliarDTO);
    const novaVisita = new VisitaFamiliarModel(dadosEntidade);
    const visitaSalva = await novaVisita.save();
    
    return VisitaFamiliarMapper.paraDTO(visitaSalva);
  }

  static normalizarNome(nome) {
    if (!nome) return nome;
    return nome.trim()
      .split(/\s+/)
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
      .join(' ');
  }

  static normalizarRelacao(relacao) {
    if (!relacao) return relacao;
    return relacao.trim()
      .split(/\s+/)
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
      .join(' ');
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

  static async buscarPorId(id) {
    const entidade = await VisitaFamiliarModel.findById(id).populate('detento');
    
    if (!entidade) {
      throw new RecursoNaoEncontradoExcecao('Visita familiar não encontrada');
    }
    
    return VisitaFamiliarMapper.paraDTO(entidade);
  }

  static async editar(id, visitaFamiliarDTO) {
    if (visitaFamiliarDTO.nomeFamiliar) {
      visitaFamiliarDTO.nomeFamiliar = VisitaFamiliarService.normalizarNome(visitaFamiliarDTO.nomeFamiliar);
    }
    if (visitaFamiliarDTO.relacao) {
      visitaFamiliarDTO.relacao = VisitaFamiliarService.normalizarRelacao(visitaFamiliarDTO.relacao);
    }
    
    await VisitaFamiliarService.validarDetentoExiste(visitaFamiliarDTO.detentoId);
    
    const dadosEntidade = VisitaFamiliarMapper.paraEntidade(visitaFamiliarDTO);
    const entidadeAtualizada = await VisitaFamiliarModel.findByIdAndUpdate(
      id,
      dadosEntidade,
      { new: true }
    ).populate('detento');
    
    if (!entidadeAtualizada) {
      throw new RecursoNaoEncontradoExcecao('Visita familiar não encontrada');
    }
    
    return VisitaFamiliarMapper.paraDTO(entidadeAtualizada);
  }

  static async listar() {
    const entidades = await VisitaFamiliarModel.find().populate('detento');
    return VisitaFamiliarMapper.paraListaDTO(entidades);
  }

  static async listarPorData(dataInicio, dataFim) {
    const entidades = await VisitaFamiliarModel.find({
      dataVisita: { $gte: dataInicio, $lte: dataFim }
    }).populate('detento');
    
    return VisitaFamiliarMapper.paraListaDTO(entidades);
  }

  static async excluir(id) {
    const visita = await VisitaFamiliarModel.findById(id);
    if (!visita) {
      throw new RecursoNaoEncontradoExcecao('Visita familiar não encontrada');
    }
    
    await VisitaFamiliarModel.findByIdAndDelete(id);
  }

  static async listarPaginado(pagina = 1, limite = 5, busca = '') {
    const query = VisitaFamiliarService.construirQueryFiltros(busca);
    const [visitas, total] = await VisitaFamiliarService.buscarVisitasPaginadas(query, pagina, limite);
    
    return VisitaFamiliarService.formatarResultadoPaginado(visitas, total, pagina, limite);
  }

  static construirQueryFiltros(busca) {
    if (!busca) return {};

    return {
      $or: [
        { nomeFamiliar: { $regex: new RegExp(busca, 'i') } },
        { relacao: { $regex: new RegExp(busca, 'i') } }
      ]
    };
  }

  static async buscarVisitasPaginadas(query, pagina, limite) {
    const skip = (pagina - 1) * limite;
    
    return await Promise.all([
      VisitaFamiliarModel.find(query)
        .populate('detento')
        .skip(skip)
        .limit(limite),
      VisitaFamiliarModel.countDocuments(query)
    ]);
  }

  static formatarResultadoPaginado(visitas, total, pagina, limite) {
    return {
      visitas: VisitaFamiliarMapper.paraListaDTO(visitas),
      total,
      page: pagina,
      totalPages: Math.ceil(total / limite)
    };
  }
}

module.exports = VisitaFamiliarService;
