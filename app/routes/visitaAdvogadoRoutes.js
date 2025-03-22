const express = require('express');
const router = express.Router();
const VisitaAdvogadoController = require('../controllers/VisitaAdvogadoController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const session = require('../middlewares/autenticate');

const validator = require('../middlewares/validator');



router.get('/lista', authenticate, authorize('ADMIN', 'DIRETOR', 'INSPETOR'), session, VisitaAdvogadoController.listar);

router.get('/cadastrar', authenticate, authorize('DIRETOR', 'INSPETOR','ADMIN'), session, VisitaAdvogadoController.cadastrar);

router.post('/cadastrar', authenticate, authorize('DIRETOR', 'INSPETOR','ADMIN'), session, VisitaAdvogadoController.cadastrar);

router.get('/:id/editar', authenticate, authorize('DIRETOR', 'INSPETOR','ADMIN'), session, VisitaAdvogadoController.editar);

router.post('/:id/editar', authenticate, authorize('DIRETOR', 'INSPETOR','ADMIN'), session, VisitaAdvogadoController.editar);

router.get('/:id/excluir', authenticate, authorize('DIRETOR', 'INSPETOR','ADMIN'), session, VisitaAdvogadoController.excluir);

module.exports = router;