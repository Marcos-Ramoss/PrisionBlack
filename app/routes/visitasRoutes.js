const express = require('express');
const router = express.Router();
const VisitaController = require('../controllers/VisitaController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const session = require('../middlewares/autenticate');

// Rota para listar todas as visitas (familiares e advogados)
router.get('/lista', authenticate, authorize('ADMIN', 'DIRETOR', 'INSPETOR'), session, VisitaController.listar);

// Rotas para cadastrar visitas
router.get('/cadastrar', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, VisitaController.cadastrar);
router.post('/cadastrar', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, VisitaController.cadastrar);

// Rotas para editar visitas (note que agora precisamos do tipo de visita)
router.get('/:tipo/:id/editar', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, VisitaController.editar);
router.post('/:tipo/:id/editar', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, VisitaController.editar);

// Rota para excluir visitas
router.get('/:tipo/:id/excluir', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, VisitaController.excluir);

module.exports = router; 