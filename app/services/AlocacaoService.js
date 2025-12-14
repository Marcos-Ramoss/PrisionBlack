const CelaModel = require('../models/CelaModel');
const DetentoModel = require('../models/DetentoModel');
const CelaMapper = require('../mappers/CelaMapper');
const RecursoNaoEncontradoExcecao = require('../exceptions/RecursoNaoEncontradoExcecao');
const RegraNegocioExcecao = require('../exceptions/RegraNegocioExcecao');

class AlocacaoService {
  static async alocarDetento(celaId, detentoId, usuarioAlocador) {
    const cela = await AlocacaoService.buscarCelaPorId(celaId);
    const detento = await AlocacaoService.buscarDetentoPorId(detentoId);
    
    AlocacaoService.validarCapacidadeCela(cela);
    await AlocacaoService.removerDeCelaAnterior(detento, detentoId);
    await AlocacaoService.alocarNaNovaCela(cela, detento, usuarioAlocador);
    
    return { sucesso: true, mensagem: 'Detento alocado com sucesso.' };
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

  static async removerDeCelaAnterior(detento, detentoId) {
    if (!detento.cela) return;

    const celaAtual = await CelaModel.findById(detento.cela);
    if (celaAtual) {
      celaAtual.ocupantes = celaAtual.ocupantes.filter(
        ocupanteId => ocupanteId.toString() !== detentoId
      );
      await celaAtual.save();
    }
  }

  static async alocarNaNovaCela(cela, detento, usuarioAlocador) {
    cela.ocupantes.push(detento._id);
    await cela.save();

    detento.cela = cela._id;
    await this.adicionarHistoricoAlocacao(detento, cela, usuarioAlocador);
    await detento.save();
  }

  static adicionarHistoricoAlocacao(detento, cela, usuarioAlocador) {
    const alocacaoHistorico = {
      data: new Date(),
      celaCodigo: `${cela.pavilhao}/${cela.codigo}`,
      usuarioAlocador: usuarioAlocador?.nome || 'Sistema'
    };

    if (!detento.historicoAlocacao) {
      detento.historicoAlocacao = [];
    }
    
    detento.historicoAlocacao.push(alocacaoHistorico);
  }

  static async removerDetento(celaId, detentoId) {
    const cela = await AlocacaoService.buscarCelaPorId(celaId);
    const detento = await AlocacaoService.buscarDetentoPorId(detentoId);
    
    await AlocacaoService.removerDetentoDaCela(cela, detentoId);
    await AlocacaoService.limparCelaDoDetento(detento);
    
    return { sucesso: true, mensagem: 'Detento removido da cela com sucesso.' };
  }

  static async removerDetentoDaCela(cela, detentoId) {
    cela.ocupantes = cela.ocupantes.filter(
      ocupanteId => ocupanteId.toString() !== detentoId
    );
    await cela.save();
  }

  static async limparCelaDoDetento(detento) {
    detento.cela = null;
    await detento.save();
  }

  static async listarAlocacoes() {
    const celas = await CelaModel.find().populate({
      path: 'ocupantes',
      select: 'nome idade estadoCivil'
    });
    return CelaMapper.paraListaDTO(celas);
  }
}

module.exports = AlocacaoService;
