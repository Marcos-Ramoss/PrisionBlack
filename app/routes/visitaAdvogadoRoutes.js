const express = require('express');
const router = express.Router();
const VisitaAdvogadoController = require('../controllers/VisitaAdvogadoController');
const  { authenticate, authorize } = require('../middlewares/authMiddleware');

router.get('/lista', authenticate, authorize('ADMIN', 'DIRETOR', 'INSPETOR'), VisitaAdvogadoController.listar);

router.get('/cadastrar', authenticate, authorize('DIRETOR', 'INSPETOR'), VisitaAdvogadoController.cadastrar);

router.post('/cadastrar', authenticate, authorize('DIRETOR', 'INSPETOR'),  VisitaAdvogadoController.cadastrar);

router.get('/:id/editar', authenticate, authorize('DIRETOR', 'INSPETOR'), VisitaAdvogadoController.editar);

router.post('/:id/editar',authenticate, authorize('DIRETOR', 'INSPETOR'), VisitaAdvogadoController.editar);

router.get('/:id/excluir',authenticate, authorize('DIRETOR', 'INSPETOR'), VisitaAdvogadoController.excluir);

module.exports = router;