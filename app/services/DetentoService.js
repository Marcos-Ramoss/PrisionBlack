const DetentoModel = require('../models/DetentoModel');

class DetentoService {
  static async cadastrar(dados) {
    const novoDetento = new DetentoModel(dados);
    return await novoDetento.save();
  }

  static async listar() {
    return await DetentoModel.find().populate('cela');
  }
}

module.exports = DetentoService;