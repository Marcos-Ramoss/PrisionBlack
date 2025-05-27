const express = require('express');
const router = express.Router();
const VisitaController = require('../controllers/VisitaController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const session = require('../middlewares/autenticate');

router.get('/lista', authenticate, authorize('ADMIN', 'DIRETOR', 'INSPETOR'), session, VisitaController.listar);
router.get('/cadastrar', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, VisitaController.cadastrar);
router.post('/cadastrar', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, VisitaController.cadastrar);
router.get('/:tipo/:id/editar', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, VisitaController.editar);
router.post('/:tipo/:id/editar', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, VisitaController.editar);
router.get('/:tipo/:id/excluir', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, VisitaController.excluir);

module.exports = router; 