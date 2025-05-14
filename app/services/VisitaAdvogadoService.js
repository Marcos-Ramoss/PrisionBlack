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

    static async listarPaginado(page = 1, limit = 5, search = '') {
        const skip = (page - 1) * limit;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { nomeAdvogado: { $regex: new RegExp(search, 'i') } },
                    { numeroOAB: { $regex: new RegExp(search, 'i') } }
                ]
            };
        }
        const [visitas, total] = await Promise.all([
            VisitaAdvogadoModel.find(query)
                .populate('detento')
                .skip(skip)
                .limit(limit),
            VisitaAdvogadoModel.countDocuments(query)
        ]);
        return {
            visitas,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
}

module.exports = VisitaAdvogadoService;