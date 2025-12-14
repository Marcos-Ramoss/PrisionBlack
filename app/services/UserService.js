const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const UsuarioMapper = require('../mappers/UsuarioMapper');
const RecursoNaoEncontradoExcecao = require('../exceptions/RecursoNaoEncontradoExcecao');
const RegraNegocioExcecao = require('../exceptions/RegraNegocioExcecao');
const AcessoNegadoExcecao = require('../exceptions/AcessoNegadoExcecao');

class UserService {
  static async listarUsuarios() {
    const entidades = await UserModel.find({}, '-senha');
    return UsuarioMapper.paraListaDTO(entidades);
  }

  static async criarUsuario(usuarioDTO, usuarioLogado) {
    UserService.validarPermissoesCriacao(usuarioDTO.nivelAcesso, usuarioLogado);
    await UserService.validarEmailUnico(usuarioDTO.email);
    
    const senhaHash = await UserService.criptografarSenha(usuarioDTO.senha);
    const dadosEntidade = UsuarioMapper.paraEntidade({
      ...usuarioDTO,
      senha: senhaHash,
      criadoPor: usuarioLogado._id
    });

    const novoUsuario = new UserModel(dadosEntidade);
    const usuarioSalvo = await novoUsuario.save();
    
    return UsuarioMapper.paraDTO(usuarioSalvo);
  }

  static validarPermissoesCriacao(nivelAcesso, usuarioLogado) {
    if (usuarioLogado.nivelAcesso === 'ADMIN') {
      if (nivelAcesso !== 'DIRETOR' && nivelAcesso !== 'INSPETOR') {
        throw new AcessoNegadoExcecao('Admin só pode cadastrar diretores e inspetores');
      }
    } else if (usuarioLogado.nivelAcesso === 'DIRETOR') {
      if (nivelAcesso !== 'INSPETOR') {
        throw new AcessoNegadoExcecao('Diretor só pode cadastrar inspetores');
      }
    } else {
      throw new AcessoNegadoExcecao('Usuário sem permissão para cadastrar');
    }
  }

  static async validarEmailUnico(email) {
    const emailExiste = await UserModel.findOne({ email });
    if (emailExiste) {
      throw new RegraNegocioExcecao('Email já cadastrado');
    }
  }

  static async criptografarSenha(senha) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(senha, salt);
  }

  static async excluirUsuario(id, usuarioLogado) {
    const usuarioParaExcluir = await UserService.buscarUsuarioPorId(id);
    UserService.validarExclusaoProprioUsuario(usuarioParaExcluir, usuarioLogado);
    UserService.validarPermissoesExclusao(usuarioParaExcluir, usuarioLogado);
    
    await UserModel.findByIdAndDelete(id);
  }

  static async buscarUsuarioPorId(id) {
    const usuario = await UserModel.findById(id);
    if (!usuario) {
      throw new RecursoNaoEncontradoExcecao('Usuário não encontrado');
    }
    return usuario;
  }

  static validarExclusaoProprioUsuario(usuarioParaExcluir, usuarioLogado) {
    if (usuarioParaExcluir._id.toString() === usuarioLogado._id.toString()) {
      throw new RegraNegocioExcecao('Você não pode excluir seu próprio usuário');
    }
  }

  static validarPermissoesExclusao(usuarioParaExcluir, usuarioLogado) {
    if (usuarioLogado.nivelAcesso === 'ADMIN') {
      if (usuarioParaExcluir.nivelAcesso !== 'DIRETOR' && 
          usuarioParaExcluir.nivelAcesso !== 'INSPETOR') {
        throw new AcessoNegadoExcecao('Admin só pode excluir diretores e inspetores');
      }
    } else if (usuarioLogado.nivelAcesso === 'DIRETOR') {
      const podeExcluir = usuarioParaExcluir.nivelAcesso === 'INSPETOR' &&
        usuarioParaExcluir.criadoPor?.toString() === usuarioLogado._id.toString();
      
      if (!podeExcluir) {
        throw new AcessoNegadoExcecao('Diretor só pode excluir inspetores que ele criou');
      }
    } else {
      throw new AcessoNegadoExcecao('Usuário sem permissão para excluir');
    }
  }
}

module.exports = UserService;
