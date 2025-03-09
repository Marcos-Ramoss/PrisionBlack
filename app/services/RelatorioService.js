const CelaModel = require('../models/CelaModel');
const DetentoModel = require('../models/DetentoModel');

class RelatorioService {
  static async gerarOcupacao() {
    const celas = await CelaModel.find().populate({
      path: 'ocupantes',
      select: 'nome idade estadoCivil'
    });
    return celas;
  }

  static async gerarSaidas() {
    return await DetentoModel.find({ saida: { $exists: true } });
  }
}

module.exports = RelatorioService;