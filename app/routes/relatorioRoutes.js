const express = require('express');
const router = express.Router();
const RelatorioController = require('../controllers/RelatorioController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Relatório de Ocupação de Celas
router.get('/ocupacao', authenticate, authorize('DIRETOR', 'ADMIN', 'INSPETOR'), RelatorioController.ocupacao);

router.get('/saidas', authenticate, authorize('DIRETOR','ADMIN', 'INSPETOR'), RelatorioController.saidas);

module.exports = router;