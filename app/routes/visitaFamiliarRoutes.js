const express = require('express');
const router = express.Router();
const VisitaFamiliarController = require('../controllers/VisitaFamiliarController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const session = require('../middlewares/autenticate');

// Rota para listar todas as visitas
router.get('/lista', authenticate, authorize('ADMIN', 'DIRETOR', 'INSPETOR'), session, VisitaFamiliarController.listar);

// Rota para renderizar o formulário de cadastro
router.get('/cadastrar', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, VisitaFamiliarController.cadastrar);

// Rota para cadastrar uma nova visita
router.post('/cadastrar', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, VisitaFamiliarController.cadastrar);

// Rota para renderizar o formulário de edição
router.get('/:id/editar', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, VisitaFamiliarController.editar);

// Rota para atualizar uma visita
router.post('/:id/editar', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, VisitaFamiliarController.editar);

// Rota para listar visitas por data
router.get('/por-data', authenticate, authorize('ADMIN', 'DIRETOR', 'INSPETOR'), session, VisitaFamiliarController.listarPorData);

router.get('/:id/excluir', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, VisitaFamiliarController.excluir);

module.exports = router;