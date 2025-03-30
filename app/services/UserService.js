const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');

class UserService {
  static async listarUsuarios() {
    return await UserModel.find({}, '-senha');
  }

  static async criarUsuario(dados, usuarioLogado) {
    const { nome, email, senha, nivelAcesso } = dados;

    // Validações de permissão
    if (usuarioLogado.nivelAcesso === 'ADMIN') {
      if (nivelAcesso !== 'DIRETOR' && nivelAcesso !== 'INSPETOR') {
        throw new Error('Admin só pode cadastrar diretores e inspetores.');
      }
    } else if (usuarioLogado.nivelAcesso === 'DIRETOR') {
      if (nivelAcesso !== 'INSPETOR') {
        throw new Error('Diretor só pode cadastrar inspetores.');
      }
    } else {
      throw new Error('Usuário sem permissão para cadastrar.');
    }

    // Verificar email existente
    const emailExiste = await UserModel.findOne({ email });
    if (emailExiste) {
      throw new Error('Email já cadastrado.');
    }

    // Criar hash da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Criar novo usuário
    const novoUsuario = new UserModel({
      nome,
      email,
      senha: senhaHash,
      nivelAcesso,
      criadoPor: usuarioLogado._id
    });

    await novoUsuario.save();
    return novoUsuario;
  }

  static async excluirUsuario(id, usuarioLogado) {
    console.log('Iniciando processo de exclusão de usuário');
    console.log('ID do usuário a ser excluído:', id);
    console.log('Usuário que está tentando excluir:', usuarioLogado);
    
    const usuarioParaExcluir = await UserModel.findById(id);
    console.log('Usuário encontrado:', usuarioParaExcluir);
    
    if (!usuarioParaExcluir) {
      throw new Error('Usuário não encontrado.');
    }

    // Não permitir excluir o próprio usuário
    if (usuarioParaExcluir._id.toString() === usuarioLogado._id.toString()) {
      throw new Error('Você não pode excluir seu próprio usuário.');
    }

    // Validações de permissão
    if (usuarioLogado.nivelAcesso === 'ADMIN') {
      if (usuarioParaExcluir.nivelAcesso !== 'DIRETOR' && usuarioParaExcluir.nivelAcesso !== 'INSPETOR') {
        throw new Error('Admin só pode excluir diretores e inspetores.');
      }
    } else if (usuarioLogado.nivelAcesso === 'DIRETOR') {
      if (usuarioParaExcluir.nivelAcesso !== 'INSPETOR' || 
          usuarioParaExcluir.criadoPor.toString() !== usuarioLogado._id.toString()) {
        throw new Error('Diretor só pode excluir inspetores que ele criou.');
      }
    } else {
      throw new Error('Usuário sem permissão para excluir.');
    }

    console.log('Todas as validações passaram, procedendo com a exclusão');
    const resultado = await UserModel.findByIdAndDelete(id);
    console.log('Resultado da exclusão:', resultado);
  }
}

module.exports = UserService; 