const DetentoModel = require('../models/DetentoModel');

class DetentoService {
  static async cadastrar(dados) {
    const novoDetento = new DetentoModel(dados);
    return await novoDetento.save();
  }

  static async listar() {
    return await DetentoModel.find().populate('cela');
  }

  static async buscarPorId(id) {
    return await DetentoModel.findById(id).populate('cela');
  }

  static async atualizar(id, dados) {
    return await DetentoModel.findByIdAndUpdate(id, dados, { new: true });
  }

  static async excluir(id) {
    return await DetentoModel.findByIdAndDelete(id);
  }

  static async pesquisarPorNome(nome) {
    return await DetentoModel.find({ nome: { $regex: new RegExp(nome, 'i') } });
  }

}

module.exports = DetentoService;