const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const session = require('../middlewares/autenticate');
const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');

// Rota para cadastrar novo usuário (Diretor ou Inspetor)
router.post('/cadastrar-usuario', authenticate, session, async (req, res) => {
  try {
    const { nome, email, senha, nivelAcesso } = req.body;
    const usuarioLogado = req.usuario;

    // Verifica se o usuário tem permissão para criar o tipo de usuário solicitado
    if (usuarioLogado.nivelAcesso === 'ADMIN') {
      if (nivelAcesso !== 'DIRETOR') {
        return res.status(403).json({ success: false, error: 'Admin só pode cadastrar diretores.' });
      }
    } else if (usuarioLogado.nivelAcesso === 'DIRETOR') {
      if (nivelAcesso !== 'INSPETOR') {
        return res.status(403).json({ success: false, error: 'Diretor só pode cadastrar inspetores.' });
      }
    } else {
      return res.status(403).json({ success: false, error: 'Usuário sem permissão para cadastrar.' });
    }

    // Verifica se o email já existe
    const emailExiste = await UserModel.findOne({ email });
    if (emailExiste) {
      return res.status(400).json({ success: false, error: 'Email já cadastrado.' });
    }

    // Cria hash da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Cria novo usuário
    const novoUsuario = new UserModel({
      nome,
      email,
      senha: senhaHash,
      nivelAcesso,
      criadoPor: usuarioLogado._id
    });

    await novoUsuario.save();

    res.status(201).json({ success: true, message: 'Usuário cadastrado com sucesso.' });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error.message);
    res.status(500).json({ success: false, error: 'Erro ao cadastrar usuário.' });
  }
});

// Rota para listar usuários baseado no nível de acesso do usuário logado
router.get('/listar-usuarios', authenticate, session, async (req, res) => {
  try {
    const usuarioLogado = req.usuario;
    let query = {};

    // Filtra usuários baseado no nível de acesso do usuário logado
    if (usuarioLogado.nivelAcesso === 'ADMIN') {
      query = { nivelAcesso: 'DIRETOR' };
    } else if (usuarioLogado.nivelAcesso === 'DIRETOR') {
      query = { 
        nivelAcesso: 'INSPETOR',
        criadoPor: usuarioLogado._id
      };
    }

    const usuarios = await UserModel.find(query).select('-senha');
    res.json({ success: true, usuarios });
  } catch (error) {
    console.error('Erro ao listar usuários:', error.message);
    res.status(500).json({ success: false, error: 'Erro ao listar usuários.' });
  }
});

// Rota para excluir usuário
router.delete('/excluir-usuario/:id', authenticate, session, async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioLogado = req.usuario;
    const usuarioParaExcluir = await UserModel.findById(id);

    if (!usuarioParaExcluir) {
      return res.status(404).json({ success: false, error: 'Usuário não encontrado.' });
    }

    // Verifica permissão para excluir
    if (usuarioLogado.nivelAcesso === 'ADMIN') {
      if (usuarioParaExcluir.nivelAcesso !== 'DIRETOR') {
        return res.status(403).json({ success: false, error: 'Admin só pode excluir diretores.' });
      }
    } else if (usuarioLogado.nivelAcesso === 'DIRETOR') {
      if (usuarioParaExcluir.nivelAcesso !== 'INSPETOR' || 
          usuarioParaExcluir.criadoPor.toString() !== usuarioLogado._id.toString()) {
        return res.status(403).json({ success: false, error: 'Sem permissão para excluir este usuário.' });
      }
    } else {
      return res.status(403).json({ success: false, error: 'Usuário sem permissão para excluir.' });
    }

    await UserModel.findByIdAndDelete(id);
    res.json({ success: true, message: 'Usuário excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error.message);
    res.status(500).json({ success: false, error: 'Erro ao excluir usuário.' });
  }
});

module.exports = router; 