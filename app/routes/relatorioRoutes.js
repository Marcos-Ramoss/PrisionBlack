const express = require('express');
const router = express.Router();
const RelatorioController = require('../controllers/RelatorioController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const session = require('../middlewares/autenticate');

router.get('/ocupacao', authenticate, authorize('DIRETOR', 'ADMIN', 'INSPETOR'), session, RelatorioController.ocupacao);
router.get('/saidas', authenticate, authorize('DIRETOR', 'ADMIN', 'INSPETOR'), session, RelatorioController.saidas);

module.exports = router;