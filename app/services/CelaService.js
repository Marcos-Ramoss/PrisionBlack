const CelaModel = require ('../models/CelaModel');
const DetentoModel = require('../models/DetentoModel');
const LogService = require('./LogService');

class CelaService {
  static async listar() {
    return await CelaModel.find().populate({
      path: 'ocupantes',
      select: 'nome idade estadoCivil'
    });
  }

  static async listar() {
    return await CelaModel.find().populate('ocupantes');
  }

  static async buscarPorId(id) {
    return await CelaModel.findById(id).populate({
      path: 'ocupantes',
      select: 'nome idade estadoCivil'
    });
  }

  static async cadastrar(dados) {
    const { codigo, pavilhao, capacidade } = dados;
    
    // Verifica se a cela já existe
    const celaExistente = await CelaModel.findOne({ codigo });
    if (celaExistente) {
      throw new Error('cela já cadastrada');
    }

    const novaCela = new CelaModel({ codigo, pavilhao, capacidade, ocupantes: [] });
    return await novaCela.save();
  }

  static async validarDetentos(detentos) {
    try {
      // Busca todas as celas que contêm algum dos detentos na lista de ocupantes
      const celasComDetentos = await CelaModel.find({ ocupantes: { $in: detentos } });

      if (celasComDetentos.length > 0) {
        // Extrai os IDs dos detentos que já estão associados a outras celas
        const detentosJaCadastrados = celasComDetentos.flatMap(detentos => CelaModel.ocupantes);
        return detentosJaCadastrados;
      }

      return null; // Nenhum detento duplicado encontrado
    } catch (error) {
      throw new Error('Erro ao validar detentos: ' + error.message);
    }
  }

  static async alocar(celaId, detentoId) {
    const cela = await CelaModel.findById(celaId);
    if (!cela) throw new Error('Cela não encontrada.');

    const detento = await DetentoModel.findById(detentoId);
    if (!detento) throw new Error('Detento não encontrado.');

    if (cela.ocupantes.length >= cela.capacidade) {
      throw new Error('A cela está cheia.');
    }

    cela.ocupantes.push(detento._id);
    await cela.save();

    detento.cela = cela._id;
    await detento.save();

    return cela;
  }

  static async editar(id, dadosAtualizados) {
    return await CelaModel.findByIdAndUpdate(id, dadosAtualizados, { new: true });
  }

  static async excluir(id) {
    return await CelaModel.findByIdAndDelete(id);
  }

}

module.exports = CelaService;