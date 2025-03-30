const bcrypt = require('bcrypt');
const Usuario = require('../models/UserModel');

class AuthService {
  // Validação dos dados do usuário
  static validateUserData(data) {
    console.log('Validando dados do usuário:', { ...data, senha: data.senha ? 'presente' : 'ausente' });
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
    try {
      console.log('Iniciando criação de usuário...');
      this.validateUserData(data); // Valida os dados

      const { nome, email, senha, nivelAcesso, criadoPor } = data;

      // Verifica se o email já está cadastrado
      console.log('Verificando email existente...');
      const usuarioExistente = await Usuario.findOne({ email });
      if (usuarioExistente) {
        throw new Error('Este email já está cadastrado.');
      }

      // Criptografa a senha
      console.log('Criptografando senha...');
      const senhaHash = await bcrypt.hash(senha, 10);

      // Cria o novo usuário
      console.log('Criando objeto do usuário...');
      const novoUsuario = new Usuario({
        nome,
        email,
        senha: senhaHash,
        nivelAcesso,
        criadoPor: criadoPor || null // Garante que criadoPor seja null se não for fornecido
      });

      // Salva o usuário no banco
      console.log('Salvando usuário no banco...');
      const usuarioSalvo = await novoUsuario.save();
      console.log('Usuário salvo com sucesso:', { 
        id: usuarioSalvo._id, 
        email: usuarioSalvo.email,
        nivelAcesso: usuarioSalvo.nivelAcesso 
      });

      return usuarioSalvo;
    } catch (error) {
      console.error('Erro detalhado ao criar usuário:', error);
      if (error.name === 'ValidationError') {
        throw new Error(`Erro de validação: ${Object.values(error.errors).map(err => err.message).join(', ')}`);
      }
      throw error;
    }
  }
}

module.exports = AuthService;