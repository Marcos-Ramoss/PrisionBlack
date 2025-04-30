const express = require('express');
const router = express.Router();
const AlocacaoController = require('../controllers/AlocacaoController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const session = require('../middlewares/autenticate');


router.get('/detalhes', authenticate, authorize('INSPETOR','ADMIN', 'DIRETOR'), session, AlocacaoController.detalhes);

// Rota para alocar um detento em uma cela (POST)
router.post('/alocar', authenticate, authorize('INSPETOR','ADMIN', 'DIRETOR'), session, AlocacaoController.alocar);

// Rota para remover um detento de uma cela (DELETE)
router.delete('/:celaId/remover/:detentoId', authenticate, authorize('INSPETOR','ADMIN', 'DIRETOR'), session, AlocacaoController.remover);

module.exports = router;