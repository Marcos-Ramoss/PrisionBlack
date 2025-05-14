const DetentoModel = require('../models/DetentoModel');
const CelaModel = require('../models/CelaModel');
const VisitaFamiliarModel = require('../models/VisitaFamiliarModel');
const VisitaAdvogadoModel = require('../models/VisitaAdvogadoModel');

class DetentoService {
  static async cadastrar(dados) {
    try {
      const { nome, idade, filiacao, estadoCivil, foto, reincidencia, crimes, cela, registradoPor, usuarioCadastro, comAlocacaoInicial } = dados;

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

      // Preparar entrada do histórico de alocação se for cadastrado diretamente na cela
      let historicoAlocacao = [];
      if (cela && comAlocacaoInicial) {
        const celaExistente = await CelaModel.findById(cela);
        historicoAlocacao.push({
          data: new Date(),
          celaCodigo: celaExistente ? `${celaExistente.pavilhao}/${celaExistente.codigo}` : 'Desconhecida',
          usuarioAlocador: registradoPor || usuarioCadastro || 'Sistema'
        });
      }

      const novoDetento = new DetentoModel({
        nome,
        idade,
        filiacao,
        estadoCivil,
        foto,
        reincidencia,
        crimes,
        cela,
        // Adicionar campos de registro
        registradoPor: registradoPor || usuarioCadastro || 'Sistema',
        usuarioCadastro: usuarioCadastro || registradoPor || 'Sistema',
        dataRegistro: new Date(),
        // Adicionar histórico de alocação se aplicável
        historicoAlocacao: historicoAlocacao
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
    // Buscar o detento para obter a cela associada
    const detento = await DetentoModel.findById(id);
    if (!detento) {
      throw new Error('Detento não encontrado.');
    }

    // Remover o detento da lista de ocupantes da cela
    if (detento.cela) {
      await CelaModel.findByIdAndUpdate(detento.cela, {
        $pull: { ocupantes: detento._id }
      });
    }

    // Excluir visitas associadas
    await VisitaFamiliarModel.deleteMany({ detento: id });
    await VisitaAdvogadoModel.deleteMany({ detento: id });

    // Excluir o detento
    return await DetentoModel.findByIdAndDelete(id);
  }


  static async pesquisarPorNome(nome) {
    return await DetentoModel.find({ nome: { $regex: new RegExp(nome, 'i') } });
  }

  static async listarPaginado(page = 1, limit = 5, search = '', pavilhao = '', reincidencia = '') {
    const skip = (page - 1) * limit;
    let query = {};
    if (search) {
      query.nome = { $regex: new RegExp(search, 'i') };
    }
    if (reincidencia === 'true') {
      query.reincidencia = true;
    } else if (reincidencia === 'false') {
      query.reincidencia = false;
    }
    let detentos = await DetentoModel.find(query)
      .populate({ path: 'cela', select: 'codigo pavilhao capacidade' });
    if (pavilhao) {
      detentos = detentos.filter(d => d.cela && d.cela.pavilhao === pavilhao);
    }
    const total = detentos.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedDetentos = detentos.slice(skip, skip + limit);
    return {
      detentos: paginatedDetentos,
      total,
      page,
      totalPages
    };
  }

}

module.exports = DetentoService;