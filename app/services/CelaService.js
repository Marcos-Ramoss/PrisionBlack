const CelaModel = require('../models/CelaModel');
const DetentoModel = require('../models/DetentoModel');
const CelaMapper = require('../mappers/CelaMapper');
const RecursoNaoEncontradoExcecao = require('../exceptions/RecursoNaoEncontradoExcecao');
const RegraNegocioExcecao = require('../exceptions/RegraNegocioExcecao');
const ValidacaoExcecao = require('../exceptions/ValidacaoExcecao');

class CelaService {
  static async listar() {
    const entidades = await CelaModel.find().populate('ocupantes');
    return CelaMapper.paraListaDTO(entidades);
  }

  static async buscarPorId(id) {
    const entidade = await CelaModel.findById(id).populate({
      path: 'ocupantes',
      select: 'nome idade estadoCivil'
    });
    
    if (!entidade) {
      throw new RecursoNaoEncontradoExcecao('Cela não encontrada');
    }
    
    return CelaMapper.paraDTO(entidade);
  }

  static async cadastrar(celaDTO) {
    celaDTO.codigo = CelaService.normalizarCodigoCela(celaDTO.codigo, celaDTO.pavilhao);
    await CelaService.validarCodigoUnico(celaDTO.codigo);
    
    const dadosEntidade = CelaMapper.paraEntidade(celaDTO);
    const novaCela = new CelaModel(dadosEntidade);
    const celaSalva = await novaCela.save();
    
    return CelaMapper.paraDTO(celaSalva);
  }

  static normalizarCodigoCela(codigo, pavilhao) {
    if (!codigo) {
      throw new ValidacaoExcecao('Código da cela é obrigatório');
    }

    codigo = codigo.trim().toUpperCase();
    
    if (!codigo.includes('-')) {
      codigo = `${pavilhao}-${codigo.replace(/[^0-9]/g, '')}`;
    }
    
    const pattern = /^[A-Z]-\d{1,3}$/;
    if (!pattern.test(codigo)) {
      throw new ValidacaoExcecao('Código da cela deve seguir o padrão: Pavilhão-Número (Ex: A-101, B-205)');
    }
    
    return codigo;
  }

  static async validarCodigoUnico(codigo) {
    const celaExistente = await CelaModel.findOne({ codigo });
    if (celaExistente) {
      throw new RegraNegocioExcecao('Cela já cadastrada');
    }
  }

  static async validarDetentos(detentos) {
    const celasComDetentos = await CelaModel.find({
      ocupantes: { $in: detentos }
    });

    if (celasComDetentos.length > 0) {
      const detentosJaCadastrados = celasComDetentos.flatMap(
        cela => cela.ocupantes
      );
      return detentosJaCadastrados;
    }

    return null;
  }

  static async alocar(celaId, detentoId) {
    const cela = await CelaService.buscarCelaPorId(celaId);
    const detento = await CelaService.buscarDetentoPorId(detentoId);
    
    CelaService.validarCapacidadeCela(cela);
    
    await CelaService.adicionarDetentoNaCela(cela, detento);
    await CelaService.atualizarCelaDoDetento(detento, cela);
    
    return CelaMapper.paraDTO(cela);
  }

  static async buscarCelaPorId(id) {
    const cela = await CelaModel.findById(id);
    if (!cela) {
      throw new RecursoNaoEncontradoExcecao('Cela não encontrada');
    }
    return cela;
  }

  static async buscarDetentoPorId(id) {
    const detento = await DetentoModel.findById(id);
    if (!detento) {
      throw new RecursoNaoEncontradoExcecao('Detento não encontrado');
    }
    return detento;
  }

  static validarCapacidadeCela(cela) {
    if (cela.ocupantes.length >= cela.capacidade) {
      throw new RegraNegocioExcecao('A cela está cheia');
    }
  }

  static async adicionarDetentoNaCela(cela, detento) {
    cela.ocupantes.push(detento._id);
    await cela.save();
  }

  static async atualizarCelaDoDetento(detento, cela) {
    detento.cela = cela._id;
    await detento.save();
  }

  static async editar(id, celaDTO) {
    celaDTO.codigo = CelaService.normalizarCodigoCela(celaDTO.codigo, celaDTO.pavilhao);
    
    const dadosEntidade = CelaMapper.paraEntidade(celaDTO);
    const entidadeAtualizada = await CelaModel.findByIdAndUpdate(
      id,
      dadosEntidade,
      { new: true }
    );
    
    if (!entidadeAtualizada) {
      throw new RecursoNaoEncontradoExcecao('Cela não encontrada');
    }
    
    return CelaMapper.paraDTO(entidadeAtualizada);
  }

  static async excluir(id) {
    const cela = await CelaModel.findById(id);
    if (!cela) {
      throw new RecursoNaoEncontradoExcecao('Cela não encontrada');
    }
    
    if (cela.ocupantes.length > 0) {
      throw new RegraNegocioExcecao('Não é possível excluir cela com ocupantes');
    }
    
    await CelaModel.findByIdAndDelete(id);
  }

  static async listarPaginado(pagina = 1, limite = 5, busca = '', pavilhao = '', ocupacao = '') {
    const query = CelaService.construirQueryFiltros(busca, pavilhao);
    const celas = await CelaService.buscarCelasComFiltros(query, ocupacao);
    
    return CelaService.paginarResultados(celas, pagina, limite);
  }

  static construirQueryFiltros(busca, pavilhao) {
    const query = {};

    if (busca) {
      query.$or = [
        { codigo: { $regex: new RegExp(busca, 'i') } },
        { pavilhao: { $regex: new RegExp(busca, 'i') } }
      ];
    }

    if (pavilhao) {
      query.pavilhao = pavilhao;
    }

    return query;
  }

  static async buscarCelasComFiltros(query, ocupacao) {
    let celas = await CelaModel.find(query).populate({
      path: 'ocupantes',
      select: 'nome idade estadoCivil'
    });

    if (ocupacao === 'disponivel') {
      celas = celas.filter(cela => cela.ocupantes.length < cela.capacidade);
    } else if (ocupacao === 'cheia') {
      celas = celas.filter(cela => cela.ocupantes.length >= cela.capacidade);
    }

    return celas;
  }

  static paginarResultados(celas, pagina, limite) {
    const total = celas.length;
    const totalPages = Math.ceil(total / limite);
    const skip = (pagina - 1) * limite;
    const celasPaginadas = celas.slice(skip, skip + limite);
    
    return {
      celas: CelaMapper.paraListaDTO(celasPaginadas),
      total,
      page: pagina, // Compatibilidade com views
      totalPages
    };
  }
}

module.exports = CelaService;
