const express = require('express');
const router = express.Router();
const AlocacaoController = require('../controllers/AlocacaoController');



// Rota para exibir a página de alocação
router.get('/detalhes', AlocacaoController.detalhes);

// Rota para alocar detento
router.post('/alocar', AlocacaoController.alocar);

module.exports = router; 