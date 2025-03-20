const bcrypt = require('bcrypt');
const Usuario = require('../models/UserModel');

class AuthService {
  // Validação dos dados do usuário
  static validateUserData(data) {
    const { nome, email, senha, nivelAcesso } = data;

    if (!nome || !email || !senha || !nivelAcesso) {
      throw new Error(
        'Todos os campos são obrigatórios: nome, email, senha e nível de acesso.'
      );
    }

    if (!['ADMIN', 'DIRETOR', 'INSPETOR'].includes(nivelAcesso)) {
      throw new Error(
        'Nível de acesso inválido. Escolha entre ADMIN, DIRETOR ou INSPETOR.'
      );
    }
  }

  // Criação de um novo usuário
  static async criarUsuario(data) {
    this.validateUserData(data); // Valida os dados

    const { nome, email, senha, nivelAcesso } = data;

    // Verifica se o email já está cadastrado
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      throw new Error('Este email já está cadastrado.');
    }

    // Criptografa a senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Cria o novo usuário
    const novoUsuario = new Usuario({
      nome,
      email,
      senha: senhaHash,
      nivelAcesso,
    });

    return await novoUsuario.save();
  }
}

module.exports = AuthService;