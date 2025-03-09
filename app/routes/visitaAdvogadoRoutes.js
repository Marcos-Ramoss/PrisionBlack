const express = require('express');
const router = express.Router();
const VisitaAdvogadoController = require('../controllers/VisitaAdvogadoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/lista', authMiddleware, VisitaAdvogadoController.listar);

router.get('/cadastrar',authMiddleware, VisitaAdvogadoController.cadastrar);

router.post('/cadastrar',authMiddleware, VisitaAdvogadoController.cadastrar);

router.get('/:id/editar',authMiddleware, VisitaAdvogadoController.editar);

router.post('/:id/editar',authMiddleware, VisitaAdvogadoController.editar);

router.get('/:id/excluir',authMiddleware, VisitaAdvogadoController.excluir);

module.exports = router;