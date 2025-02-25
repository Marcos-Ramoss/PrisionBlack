const CelaModel = require('../models/CelaModel');
const DetentoModel = require('../models/DetentoModel');
const LogService = require('./LogService');

class CelaService {
    static async alocarDetento(codigoCela, idDetento) {
        const cela = await CelaModel.findOne({ codigo: codigoCela });
        if (!cela || cela.ocupantes.length >= cela.capacidade) {
            throw new Error('Cela cheia ou inexistente.');
        }

        const detento = await DetentoModel.findById(idDetento);
        if (!detento) {
            throw new Error('Detento não encontrado.');
        }

        cela.ocupantes.push(detento._id);
        detento.cela = cela._id;

        await Promise.all([cela.save(), detento.save()]);
        LogService.registrarLog('Alocação de detento', `Detento ${detento.nome} alocado na cela ${codigoCela}`);
    }

    static async transferirDetento(idDetento, novoCodigoCela) {
        const novaCela = await CelaModel.findOne({ codigo: novoCodigoCela });
        const detento = await DetentoModel.findById(idDetento);

        if (!novaCela || !detento) {
            throw new Error('Cela ou detento não encontrado.');
        }

        const antigaCela = await CelaModel.findById(detento.cela);
        antigaCela.ocupantes = antigaCela.ocupantes.filter(ocupante => ocupante.toString() !== idDetento);
        novaCela.ocupantes.push(detento._id);

        detento.cela = novaCela._id;
        detento.historicoTransferencias.push({ de: antigaCela.codigo, para: novaCela.codigo });

        await Promise.all([antigaCela.save(), novaCela.save(), detento.save()]);
        LogService.registrarLog('Transferência de detento', `Detento ${detento.nome} transferido para cela ${novoCodigoCela}`);
    }
}

module.exports = CelaService;