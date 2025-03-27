const DetentoModel = require('../models/DetentoModel');
const CelaModel = require('../models/CelaModel');

class DetentoService {
  static async cadastrar(dados) {
    try {
      const { nome, idade, filiacao, estadoCivil, foto, reincidencia, crimes, cela } = dados;

      // Se uma cela foi selecionada, verifica se ela existe e tem capacidade
      if (cela) {
        const celaExistente = await CelaModel.findById(cela);
        if (!celaExistente) {
          throw new Error('Cela não encontrada');
        }
        if (celaExistente.ocupantes.length >= celaExistente.capacidade) {
          throw new Error('Cela está cheia');
        }
      }

      const novoDetento = new DetentoModel({
        nome,
        idade,
        filiacao,
        estadoCivil,
        foto,
        reincidencia,
        crimes,
        cela
      });

      const detentoSalvo = await novoDetento.save();

      // Se uma cela foi selecionada, adiciona o detento à cela
      if (cela) {
        const celaAtualizada = await CelaModel.findById(cela);
        celaAtualizada.ocupantes.push(detentoSalvo._id);
        await celaAtualizada.save();
      }

      return detentoSalvo;
    } catch (error) {
      // Se houver erro de validação do Mongoose
      if (error.name === 'ValidationError') {
        throw new Error('Dados inválidos: ' + Object.values(error.errors).map(err => err.message).join(', '));
      }
      // Se houver erro de duplicidade
      if (error.code === 11000) {
        throw new Error('Detento já cadastrado com este nome');
      }
      throw error;
    }
  }

  static async listar() {
    return await DetentoModel.find().populate({
      path: 'cela',
      select: 'codigo pavilhao capacidade'
    });
  }

  static async buscarPorId(id) {
    return await DetentoModel.findById(id).populate({
      path: 'cela',
      select: 'codigo pavilhao capacidade'
    });
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