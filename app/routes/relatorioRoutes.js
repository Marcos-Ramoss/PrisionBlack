const express = require('express');
const router = express.Router();
const RelatorioController = require('../controllers/RelatorioController');
const authMiddleware = require('../middlewares/authMiddleware');

// Relatório de Ocupação de Celas
router.get('/ocupacao', authMiddleware, RelatorioController.ocupacao);

router.get('/saidas', authMiddleware, RelatorioController.saidas);

module.exports = router;