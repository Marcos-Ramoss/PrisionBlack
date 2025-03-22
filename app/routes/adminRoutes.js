const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const session = require('../middlewares/autenticate');
const DetentoModel = require('../models/DetentoModel');
const CelaModel = require('../models/CelaModel');
const VisitaFamiliarModel = require('../models/VisitaFamiliarModel');
const VisitaAdvogadoModel = require('../models/VisitaAdvogadoModel');
const UserModel = require('../models/UserModel');

// Rota protegida para o Dashboard do Admin
router.get('/admin/dashboard', authenticate, authorize('ADMIN'), session, async (req, res) => {
  try {
    // Obter estatísticas do sistema
    const totalDetentos = await DetentoModel.countDocuments();
    const totalCelas = await CelaModel.countDocuments();
    const totalCelasOcupadas = await CelaModel.countDocuments({ status: 'OCUPADA' });
    const totalVisitasFamiliares = await VisitaFamiliarModel.countDocuments();
    const totalVisitasAdvogados = await VisitaAdvogadoModel.countDocuments();

    // Renderizar a view do dashboard com os dados
    res.render('admin/dashboard', {
      title: 'Dashboard do Admin',
      user: req.usuario,
      totalDetentos,
      totalCelas,
      totalCelasOcupadas,
      totalCelasDisponiveis: totalCelas - totalCelasOcupadas,
      totalVisitasFamiliares,
      totalVisitasAdvogados,
    });
  } catch (error) {
    console.error('Erro ao carregar o dashboard:', error.message);
    res.status(500).json({ success: false, error: 'Erro ao carregar o dashboard.' });
  }
});

// Rota para listar inspetores e diretores
router.get('/admin/gerenciar-usuarios', authenticate, authorize('ADMIN'), session, async (req, res) => {
    try {
      // Busca todos os usuários com nível de acesso INSPETOR ou DIRETOR
      const usuarios = await UserModel.find({
        nivelAcesso: { $in: ['INSPETOR', 'DIRETOR'] },
      });
  
      // Renderiza a view de gerenciamento de usuários
      res.render('admin/gerenciar-usuarios', {
        title: 'Gerenciar Usuários',
        user: req.usuario,
        usuarios,
      });
    } catch (error) {
      console.error('Erro ao listar usuários:', error.message);
      res.status(500).json({ success: false, error: 'Erro ao listar usuários.' });
    }
  });
  
  // Rota para excluir um usuário
  router.post('/admin/excluir-usuario/:id', authenticate, authorize('ADMIN'), session, async (req, res) => {
    try {
      const { id } = req.params;
  
      // Exclui o usuário pelo ID
      await UserModel.findByIdAndDelete(id);
  
      // Redireciona de volta para a página de gerenciamento de usuários
      req.flash('success', 'Usuário excluído com sucesso.');
      res.redirect('/admin/gerenciar-usuarios');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error.message);
      req.flash('error', 'Erro ao excluir usuário.');
      res.redirect('/admin/gerenciar-usuarios');
    }
  });

module.exports = router;