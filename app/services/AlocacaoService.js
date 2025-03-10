const CelaModel = require('../models/CelaModel');
const DetentoModel = require('../models/DetentoModel');

class AlocacaoService {

  static async alocarDetento(celaId, detentoId) {
    try {
      const cela = await CelaModel.findById(celaId);
      if (!cela) throw new Error('Cela não encontrada.');

      const detento = await DetentoModel.findById(detentoId);
      if (!detento) throw new Error('Detento não encontrado.');

      if (cela.ocupantes.length >= cela.capacidade) {
        throw new Error('A cela está cheia.');
      }

      if (detento.cela) {
        throw new Error('O detento já está alocado em outra cela.');
      }

      cela.ocupantes.push(detento._id);
      await cela.save();

      detento.cela = cela._id;
      await detento.save();

      return { sucesso: true, mensagem: 'Detento alocado com sucesso.' };
    } catch (error) {
      throw error;
    }
  }

  static async removerDetento(celaId, detentoId) {
    try {
      
      const cela = await CelaModel.findById(celaId);
      if (!cela) throw new Error('Cela não encontrada.');

      const detento = await DetentoModel.findById(detentoId);
      if (!detento) throw new Error('Detento não encontrado.');

      cela.ocupantes = cela.ocupantes.filter(ocupanteId => ocupanteId.toString() !== detentoId);
      await cela.save();

      detento.cela = null;
      await detento.save();

      return { sucesso: true, mensagem: 'Detento removido da cela com sucesso.' };
    } catch (error) {
      throw error;
    }
  }

  static async listarAlocacoes() {
    try {
      const celas = await CelaModel.find().populate({
        path: 'ocupantes',
        select: 'nome idade estadoCivil' 
      });
      return celas;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AlocacaoService;