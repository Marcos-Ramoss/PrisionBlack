const express = require('express');
const router = express.Router();
const VisitaFamiliarController = require('../controllers/VisitaFamiliarController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Rota para listar todas as visitas
router.get('/lista',authenticate, authorize('ADMIN', 'DIRETOR', 'INSPETOR'), VisitaFamiliarController.listar);

// Rota para renderizar o formulário de cadastro
router.get('/cadastrar', authenticate, authorize('DIRETOR', 'INSPETOR'), VisitaFamiliarController.cadastrar);

// Rota para cadastrar uma nova visita
router.post('/cadastrar', authenticate, authorize('DIRETOR', 'INSPETOR'), VisitaFamiliarController.cadastrar);

// Rota para renderizar o formulário de edição
router.get('/:id/editar', authenticate, authorize('DIRETOR', 'INSPETOR'), VisitaFamiliarController.editar);

// Rota para atualizar uma visita
router.post('/:id/editar', authenticate, authorize('DIRETOR', 'INSPETOR'), VisitaFamiliarController.editar);

// Rota para listar visitas por data
router.get('/por-data', authenticate, authorize('ADMIM','DIRETOR', 'INSPETOR'), VisitaFamiliarController.listarPorData);

router.get('/:id/excluir',authenticate, authorize('DIRETOR', 'INSPETOR'), VisitaFamiliarController.excluir);

module.exports = router;