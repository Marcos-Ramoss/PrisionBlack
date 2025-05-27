const express = require('express');
const router = express.Router();
const AlocacaoController = require('../controllers/AlocacaoController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const session = require('../middlewares/autenticate');


router.get('/detalhes', authenticate, authorize('INSPETOR','ADMIN', 'DIRETOR'), session, AlocacaoController.detalhes);
router.post('/alocar', authenticate, authorize('INSPETOR','ADMIN', 'DIRETOR'), session, AlocacaoController.alocar);
router.delete('/:celaId/remover/:detentoId', authenticate, authorize('INSPETOR','ADMIN', 'DIRETOR'), session, AlocacaoController.remover);

module.exports = router;