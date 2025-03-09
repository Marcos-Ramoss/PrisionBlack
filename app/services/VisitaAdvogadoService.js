const VisitaAdvogadoModel = require('../models/VisitaAdvogadoModel');
const DetentoModel = require('../models/DetentoModel');

class VisitaAdvogadoService {
    static async listar() {
        return await VisitaAdvogadoModel.find().populate('detento');
    }

    static async buscarPorId(id) {
        return await VisitaAdvogadoModel.findById(id).populate('detento');
    }

    static async cadastrar(dados) {
        const novaVisita = new VisitaAdvogadoModel(dados);
        return await novaVisita.save();
    }

    static async editar(id, dadosAtualizados) {
        return await VisitaAdvogadoModel.findByIdAndUpdate(id, dadosAtualizados, { new: true });
    }

    static async excluir(id) {
        return await VisitaAdvogadoModel.findByIdAndDelete(id);
    }
}

module.exports = VisitaAdvogadoService;