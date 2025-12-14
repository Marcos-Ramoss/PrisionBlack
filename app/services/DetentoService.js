const DetentoModel = require('../models/DetentoModel');
const CelaModel = require('../models/CelaModel');
const VisitaFamiliarModel = require('../models/VisitaFamiliarModel');
const VisitaAdvogadoModel = require('../models/VisitaAdvogadoModel');
const DetentoMapper = require('../mappers/DetentoMapper');
const RecursoNaoEncontradoExcecao = require('../exceptions/RecursoNaoEncontradoExcecao');
const RegraNegocioExcecao = require('../exceptions/RegraNegocioExcecao');
const ValidacaoExcecao = require('../exceptions/ValidacaoExcecao');

class DetentoService {
  static async cadastrar(detentoDTO) {
    detentoDTO.nome = DetentoService.normalizarNome(detentoDTO.nome);
    detentoDTO.filiacao = DetentoService.normalizarFiliacao(detentoDTO.filiacao);
    
    await DetentoService.validarCelaSeInformada(detentoDTO.celaId);
    
    const historicoAlocacao = await DetentoService.criarHistoricoAlocacaoInicial(
      detentoDTO.celaId,
      detentoDTO.registradoPor,
      detentoDTO.usuarioCadastro,
      detentoDTO.comAlocacaoInicial
    );

    const dadosEntidade = DetentoMapper.paraEntidade({
      ...detentoDTO,
      historicoAlocacao,
      dataRegistro: new Date()
    });

    const detentoSalvo = await DetentoService.salvarDetento(dadosEntidade);
    await DetentoService.alocarNaCelaSeInformada(detentoDTO.celaId, detentoSalvo._id);
    
    return DetentoMapper.paraDTO(detentoSalvo);
  }

  static async validarCelaSeInformada(celaId) {
    if (!celaId) return;

    const celaExistente = await CelaModel.findById(celaId);
    if (!celaExistente) {
      throw new RecursoNaoEncontradoExcecao('Cela não encontrada');
    }
    
    if (celaExistente.ocupantes.length >= celaExistente.capacidade) {
      throw new RegraNegocioExcecao('Cela está cheia');
    }
  }

  static async criarHistoricoAlocacaoInicial(celaId, registradoPor, usuarioCadastro, comAlocacaoInicial) {
    if (!celaId || !comAlocacaoInicial) return [];

    const celaExistente = await CelaModel.findById(celaId);
    const celaCodigo = celaExistente 
      ? `${celaExistente.pavilhao}/${celaExistente.codigo}` 
      : 'Desconhecida';

    return [{
      data: new Date(),
      celaCodigo,
      usuarioAlocador: registradoPor || usuarioCadastro || 'Sistema'
    }];
  }

  static async salvarDetento(dadosEntidade) {
    try {
      const novoDetento = new DetentoModel(dadosEntidade);
      return await novoDetento.save();
    } catch (erro) {
      this.tratarErroPersistencia(erro);
    }
  }

  static async alocarNaCelaSeInformada(celaId, detentoId) {
    if (!celaId) return;

    const celaAtualizada = await CelaModel.findById(celaId);
    celaAtualizada.ocupantes.push(detentoId);
    await celaAtualizada.save();
  }

  static tratarErroPersistencia(erro) {
    if (erro.name === 'ValidationError') {
      const erros = Object.values(erro.errors).map(err => err.message);
      throw new ValidacaoExcecao('Dados inválidos', erros);
    }
    if (erro.code === 11000) {
      throw new RegraNegocioExcecao('Detento já cadastrado');
    }
    throw erro;
  }

  static async listar() {
    const entidades = await DetentoModel.find().populate({
      path: 'cela',
      select: 'codigo pavilhao capacidade'
    });
    return DetentoMapper.paraListaDTO(entidades);
  }

  static async buscarPorId(id) {
    const entidade = await DetentoModel.findById(id).populate({
      path: 'cela',
      select: 'codigo pavilhao capacidade'
    });
    
    if (!entidade) {
      throw new RecursoNaoEncontradoExcecao('Detento não encontrado');
    }
    
    return DetentoMapper.paraDTO(entidade);
  }

  static async atualizar(id, detentoDTO) {
    if (detentoDTO.nome) {
      detentoDTO.nome = DetentoService.normalizarNome(detentoDTO.nome);
    }
    if (detentoDTO.filiacao) {
      detentoDTO.filiacao = DetentoService.normalizarFiliacao(detentoDTO.filiacao);
    }
    
    const dadosEntidade = DetentoMapper.paraEntidade(detentoDTO);
    const entidadeAtualizada = await DetentoModel.findByIdAndUpdate(
      id,
      dadosEntidade,
      { new: true }
    );
    
    if (!entidadeAtualizada) {
      throw new RecursoNaoEncontradoExcecao('Detento não encontrado');
    }
    
    return DetentoMapper.paraDTO(entidadeAtualizada);
  }

  static normalizarNome(nome) {
    if (!nome) return nome;
    
    return nome.trim()
      .split(/\s+/)
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
      .join(' ');
  }

  static normalizarFiliacao(filiacao) {
    if (!filiacao) return filiacao;
    
    return filiacao.trim()
      .split(/\s*,\s*/)
      .map(parte => {
        if (parte.includes(':')) {
          const [label, valor] = parte.split(':');
          return `${label.trim()}: ${valor.trim().split(/\s+/).map(p => 
            p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
          ).join(' ')}`;
        }
        return parte.split(/\s+/).map(p => 
          p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
        ).join(' ');
      })
      .join(', ');
  }

  static async excluir(id) {
    const detento = await DetentoModel.findById(id);
    if (!detento) {
      throw new RecursoNaoEncontradoExcecao('Detento não encontrado');
    }

    await DetentoService.removerDeCela(detento);
    await DetentoService.excluirVisitas(id);
    await DetentoModel.findByIdAndDelete(id);
  }

  static async removerDeCela(detento) {
    if (!detento.cela) return;

    await CelaModel.findByIdAndUpdate(detento.cela, {
      $pull: { ocupantes: detento._id }
    });
  }

  static async excluirVisitas(detentoId) {
    await Promise.all([
      VisitaFamiliarModel.deleteMany({ detento: detentoId }),
      VisitaAdvogadoModel.deleteMany({ detento: detentoId })
    ]);
  }

  static async pesquisarPorNome(nome) {
    const entidades = await DetentoModel.find({
      nome: { $regex: new RegExp(nome, 'i') }
    });
    return DetentoMapper.paraListaDTO(entidades);
  }

  static async listarPaginado(pagina = 1, limite = 5, busca = '', pavilhao = '', reincidencia = '') {
    const query = this.construirQueryFiltros(busca, reincidencia);
    const detentos = await DetentoService.buscarDetentosComFiltros(query, pavilhao);
    
    return this.paginarResultados(detentos, pagina, limite);
  }

  static construirQueryFiltros(busca, reincidencia) {
    const query = {};
    
    if (busca) {
      query.nome = { $regex: new RegExp(busca, 'i') };
    }
    
    if (reincidencia === 'true') {
      query.reincidencia = true;
    } else if (reincidencia === 'false') {
      query.reincidencia = false;
    }
    
    return query;
  }

  static async buscarDetentosComFiltros(query, pavilhao) {
    let detentos = await DetentoModel.find(query).populate({
      path: 'cela',
      select: 'codigo pavilhao capacidade'
    });
    
    if (pavilhao) {
      detentos = detentos.filter(d => d.cela && d.cela.pavilhao === pavilhao);
    }
    
    return detentos;
  }

  static paginarResultados(detentos, pagina, limite) {
    const total = detentos.length;
    const totalPages = Math.ceil(total / limite);
    const skip = (pagina - 1) * limite;
    const detentosPaginados = detentos.slice(skip, skip + limite);
    
    return {
      detentos: DetentoMapper.paraListaDTO(detentosPaginados),
      total,
      page: pagina, // Compatibilidade com views
      totalPages
    };
  }
}

module.exports = DetentoService;
