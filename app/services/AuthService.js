const bcrypt = require('bcrypt');
const Usuario = require('../models/UserModel');
const UsuarioMapper = require('../mappers/UsuarioMapper');
const ValidacaoExcecao = require('../exceptions/ValidacaoExcecao');
const RegraNegocioExcecao = require('../exceptions/RegraNegocioExcecao');

class AuthService {
  static validarDadosUsuario(dados) {
    const { nome, email, senha, nivelAcesso } = dados;

    if (!nome || !email || !senha || !nivelAcesso) {
      throw new ValidacaoExcecao(
        'Todos os campos são obrigatórios: nome, email, senha e nível de acesso'
      );
    }

    if (!['ADMIN', 'DIRETOR', 'INSPETOR'].includes(nivelAcesso)) {
      throw new ValidacaoExcecao(
        'Nível de acesso inválido. Escolha entre ADMIN, DIRETOR ou INSPETOR'
      );
    }
  }

  static async criarUsuario(dados) {
    AuthService.validarDadosUsuario(dados);
    await AuthService.validarEmailUnico(dados.email);

    const senhaHash = await AuthService.criptografarSenha(dados.senha);
    const dadosEntidade = UsuarioMapper.paraEntidade({
      ...dados,
      senha: senhaHash
    });

    const novoUsuario = new Usuario(dadosEntidade);
    const usuarioSalvo = await novoUsuario.save();

    return UsuarioMapper.paraDTO(usuarioSalvo);
  }

  static async validarEmailUnico(email) {
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      throw new RegraNegocioExcecao('Este email já está cadastrado');
    }
  }

  static async criptografarSenha(senha) {
    return await bcrypt.hash(senha, 10);
  }
}

module.exports = AuthService;
