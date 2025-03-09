const VisitaFamiliarModel = require('../models/VisitaFamiliarModel');
const DetentoModel = require('../models/DetentoModel');

class VisitaFamiliarService {
  static async cadastrar(dados) {
    const novaVisita = new VisitaFamiliarModel(dados);
    return await novaVisita.save();
  }

  static async buscarPorId(id) {
      return await VisitaFamiliarModel.findById(id).populate('detento');
   }

  static async editar(id, dadosAtualizados) {
    return await VisitaFamiliarModel.findByIdAndUpdate(id, dadosAtualizados, { new: true });
  }

  static async listar() {
    return await VisitaFamiliarModel.find().populate('detento');
  }

  static async listarPorData(dataInicio, dataFim) {
    return await VisitaFamiliarModel.find({
      dataVisita: { $gte: dataInicio, $lte: dataFim }
    }).populate('detento');
  }

  static async excluir(id) {
    return await VisitaFamiliarModel.findByIdAndDelete(id);
  }
}

module.exports = VisitaFamiliarService;