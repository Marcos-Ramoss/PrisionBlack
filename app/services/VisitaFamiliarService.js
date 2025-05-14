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

  static async listarPaginado(page = 1, limit = 5, search = '') {
    const skip = (page - 1) * limit;
    let query = {};
    if (search) {
      query = {
        $or: [
          { nomeFamiliar: { $regex: new RegExp(search, 'i') } },
          { relacao: { $regex: new RegExp(search, 'i') } }
        ]
      };
    }
    const [visitas, total] = await Promise.all([
      VisitaFamiliarModel.find(query)
        .populate('detento')
        .skip(skip)
        .limit(limit),
      VisitaFamiliarModel.countDocuments(query)
    ]);
    return {
      visitas,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }
}

module.exports = VisitaFamiliarService;