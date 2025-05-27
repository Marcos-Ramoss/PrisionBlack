const express = require('express');
const router = express.Router();
const AlocacaoController = require('../controllers/AlocacaoController');

router.get('/detalhes', AlocacaoController.detalhes);
router.post('/alocar', AlocacaoController.alocar);

module.exports = router; 