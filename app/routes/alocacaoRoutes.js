const express = require('express');
const router = express.Router();
const AlocacaoController = require('../controllers/AlocacaoController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');


router.get('/detalhes', authenticate, authorize('INSPETOR','ADMIN', 'DIRETOR'), AlocacaoController.detalhes);

// Rota para alocar um detento em uma cela (POST)
router.post('/alocar', authenticate, authorize('INSPETOR','ADMIN', 'DIRETOR'), AlocacaoController.alocar);

// Rota para remover um detento de uma cela (DELETE)
router.delete('/:celaId/remover/:detentoId', authenticate, authorize('INSPETOR','ADMIN', 'DIRETOR'), AlocacaoController.remover);

module.exports = router;