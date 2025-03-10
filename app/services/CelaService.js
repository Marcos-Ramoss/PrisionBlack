const CelaModel = require ('../models/CelaModel');
const DetentoModel = require('../models/DetentoModel');
const LogService = require('./LogService');

class CelaService {
  static async listar() {
    return await CelaModel.find().populate('ocupantes');
  }

  static async listar() {
    return await CelaModel.find().populate('ocupantes');
  }

  static async buscarPorId(id) {
    return await CelaModel.findById(id).populate('ocupantes');
  }

  static async cadastrar(dados) {
    const { codigo, pavilhao, capacidade, ocupantes } = dados;
     // Verifica se algum dos detentos já está em outra cela
      for (const nomeId of ocupantes) {
      const celaExistente = await CelaModel.findOne({ ocupantes: nomeId });
      if (celaExistente) {
        throw new Error(`O detento ${nomeId} já está cadastrado na cela ${celaExistente.codigo}.`);
      }
    }
    const novaCela = new CelaModel({ codigo, pavilhao, capacidade, ocupantes: ocupantes || [] });
    return await novaCela.save();
  }

  static async validarDetentos(detentos) {
    try {
      // Busca todas as celas que contêm algum dos detentos na lista de ocupantes
      const celasComDetentos = await CelaModel.find({ ocupantes: { $in: detentos } });

      if (celasComDetentos.length > 0) {
        // Extrai os IDs dos detentos que já estão associados a outras celas
        const detentosJaCadastrados = celasComDetentos.flatMap(detentos => CelaModel.ocupantes);
        return detentosJaCadastrados;
      }

      return null; // Nenhum detento duplicado encontrado
    } catch (error) {
      throw new Error('Erro ao validar detentos: ' + error.message);
    }
  }

  static async alocar(celaId, detentoId) {
    const cela = await CelaModel.findById(celaId);
    if (!cela) throw new Error('Cela não encontrada.');

    const detento = await DetentoModel.findById(detentoId);
    if (!detento) throw new Error('Detento não encontrado.');

    if (cela.ocupantes.length >= cela.capacidade) {
      throw new Error('A cela está cheia.');
    }

    cela.ocupantes.push(detento._id);
    await cela.save();

    detento.cela = cela._id;
    await detento.save();

    return cela;
  }

  static async editar(id, dadosAtualizados) {
    return await CelaModel.findByIdAndUpdate(id, dadosAtualizados, { new: true });
  }

  static async excluir(id) {
    return await CelaModel.findByIdAndDelete(id);
  }

}

module.exports = CelaService;