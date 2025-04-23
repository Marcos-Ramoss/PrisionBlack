const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const session = require('../middlewares/autenticate');
const DetentoModel = require('../models/DetentoModel');
const CelaModel = require('../models/CelaModel');
const VisitaFamiliarModel = require('../models/VisitaFamiliarModel');
const VisitaAdvogadoModel = require('../models/VisitaAdvogadoModel');
const UserController = require('../controllers/UserController');
const DiretorController = require('../controllers/DiretorController');

// Rota protegida para o Dashboard do Admin
router.get('/dashboard', authenticate, authorize('ADMIN'), session, async (req, res) => {
  try {
    const { pavilhao } = req.query;
    // Obter estatísticas do sistema
    const totalDetentos = await DetentoModel.countDocuments();
    const totalCelas = await CelaModel.countDocuments();
    const totalCelasOcupadas = await CelaModel.countDocuments({ ocupantes: { $ne: [] } });
    const totalCelasAlocadas = await CelaModel.countDocuments({ 'ocupantes.0': { $exists: true } });
    const totalVisitasFamiliares = await VisitaFamiliarModel.countDocuments();
    const totalVisitasAdvogados = await VisitaAdvogadoModel.countDocuments();

    const totalCelasDisponiveis = await CelaModel.countDocuments({
      $expr: { $lt: [{ $size: "$ocupantes" }, "$capacidade"] } // Verifica se o número de ocupantes é menor que a capacidade
    });


    const celasPorPavilhao = await CelaModel.aggregate([
      { $group: { _id: "$pavilhao", total: { $sum: 1 } } }
    ]);

    let celasFiltradas = [];
    if (pavilhao) {
      celasFiltradas = await CelaModel.find({ pavilhao }).populate('ocupantes', 'nome');
    }


    // Verificar se a requisição é via fetch (AJAX)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({ celasFiltradas });
    }



    // Renderizar a view do dashboard com os dados
    res.render('admin/dashboard', {
      title: 'Dashboard do Admin',
      user: req.usuario,
      totalDetentos,
      totalCelas,
      totalCelasOcupadas,
      totalCelasAlocadas,
      totalCelasDisponiveis,
      totalVisitasFamiliares,
      totalVisitasAdvogados,
      celasPorPavilhao,
      celasFiltradas,
      pavilhaoSelecionado: pavilhao || null,
    });
  } catch (error) {
    console.error('Erro ao carregar o dashboard:', error.message);
    res.status(500).json({ success: false, error: 'Erro ao carregar o dashboard.' });
  }
});





// Rota para o Dashboard do Diretor
router.get('/diretor/dashboard', authenticate, authorize('DIRETOR'), session, DiretorController.dashboard);

// Rotas de gerenciamento de usuários
router.get('/gerenciar-usuarios', authenticate, authorize('ADMIN', 'DIRETOR'), session, UserController.listarUsuarios);
router.post('/cadastrar-usuario', authenticate, authorize('ADMIN', 'DIRETOR'), session, UserController.cadastrarUsuario);
router.post('/excluir-usuario/:id', authenticate, authorize('ADMIN', 'DIRETOR'), session, UserController.excluirUsuario);

module.exports = router;