const express = require('express');
const router = express.Router();
const VisitaFamiliarController = require('../controllers/VisitaFamiliarController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota para listar todas as visitas
router.get('/lista',authMiddleware, VisitaFamiliarController.listar);

// Rota para renderizar o formulário de cadastro
router.get('/cadastrar', authMiddleware, VisitaFamiliarController.cadastrar);

// Rota para cadastrar uma nova visita
router.post('/cadastrar', authMiddleware, VisitaFamiliarController.cadastrar);

// Rota para renderizar o formulário de edição
router.get('/:id/editar', authMiddleware, VisitaFamiliarController.editar);

// Rota para atualizar uma visita
router.post('/:id/editar', authMiddleware, VisitaFamiliarController.editar);

// Rota para listar visitas por data
router.get('/por-data', authMiddleware, VisitaFamiliarController.listarPorData);

router.get('/:id/excluir', authMiddleware, VisitaFamiliarController.excluir);

module.exports = router;