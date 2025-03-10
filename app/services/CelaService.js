const CelaModel = require('../models/CelaModel');
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
    const novaCela = new CelaModel({ codigo, pavilhao, capacidade, ocupantes: ocupantes || [] });
    return await novaCela.save();
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