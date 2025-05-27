const bcrypt = require('bcrypt');
const Usuario = require('../models/UserModel');

class AuthService {
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

  static async criarUsuario(data) {
    try {
      this.validateUserData(data);

      const { nome, email, senha, nivelAcesso, criadoPor } = data;

      const usuarioExistente = await Usuario.findOne({ email });
      if (usuarioExistente) {
        throw new Error('Este email já está cadastrado.');
      }


      const senhaHash = await bcrypt.hash(senha, 10);

      const novoUsuario = new Usuario({
        nome,
        email,
        senha: senhaHash,
        nivelAcesso,
        criadoPor: criadoPor || null
      });

      const usuarioSalvo = await novoUsuario.save();


      return usuarioSalvo;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new Error(`Erro de validação: ${Object.values(error.errors).map(err => err.message).join(', ')}`);
      }
      throw error;
    }
  }
}

module.exports = AuthService;