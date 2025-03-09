const express = require('express');
const router = express.Router();
const AlocacaoController = require('../controllers/AlocacaoController');

router.get('/detalhes', AlocacaoController.detalhes);

// Rota para alocar um detento em uma cela (POST)
router.post('/alocar', AlocacaoController.alocar);

// Rota para remover um detento de uma cela (DELETE)
router.delete('/:celaId/remover/:detentoId', AlocacaoController.remover);

module.exports = router;