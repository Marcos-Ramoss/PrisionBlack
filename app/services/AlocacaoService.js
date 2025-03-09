const CelaModel = require('../models/CelaModel');
const DetentoModel = require('../models/DetentoModel');

class AlocacaoService {
  // Aloca um detento em uma cela
  static async alocarDetento(celaId, detentoId) {
    try {
      // Busca a cela pelo ID
      const cela = await CelaModel.findById(celaId);
      if (!cela) throw new Error('Cela não encontrada.');

      // Busca o detento pelo ID
      const detento = await DetentoModel.findById(detentoId);
      if (!detento) throw new Error('Detento não encontrado.');

      // Verifica se a cela já está cheia
      if (cela.ocupantes.length >= cela.capacidade) {
        throw new Error('A cela está cheia.');
      }

      // Verifica se o detento já está alocado em outra cela
      if (detento.cela) {
        throw new Error('O detento já está alocado em outra cela.');
      }

      // Atualiza a cela com o novo ocupante
      cela.ocupantes.push(detento._id);
      await cela.save();

      // Atualiza o detento com a cela alocada
      detento.cela = cela._id;
      await detento.save();

      return { sucesso: true, mensagem: 'Detento alocado com sucesso.' };
    } catch (error) {
      throw error;
    }
  }

  // Remove um detento de uma cela
  static async removerDetento(celaId, detentoId) {
    try {
      // Busca a cela pelo ID
      const cela = await CelaModel.findById(celaId);
      if (!cela) throw new Error('Cela não encontrada.');

      // Busca o detento pelo ID
      const detento = await DetentoModel.findById(detentoId);
      if (!detento) throw new Error('Detento não encontrado.');

      // Remove o detento da lista de ocupantes da cela
      cela.ocupantes = cela.ocupantes.filter(ocupanteId => ocupanteId.toString() !== detentoId);
      await cela.save();

      // Remove a cela do detento
      detento.cela = null;
      await detento.save();

      return { sucesso: true, mensagem: 'Detento removido da cela com sucesso.' };
    } catch (error) {
      throw error;
    }
  }

  static async listarAlocacoes() {
    try {
      // Busca todas as celas e popula os ocupantes
      const celas = await CelaModel.find().populate({
        path: 'ocupantes',
        select: 'nome idade estadoCivil' // Seleciona campos relevantes do detento
      });
      return celas;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AlocacaoService;