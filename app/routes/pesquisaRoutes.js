const express = require('express');
const router = express.Router();
const PesquisaController = require('../controllers/PesquisaController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const session = require('../middlewares/autenticate');


// Rota para processar a pesquisa
router.get('/pesquisar',authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, PesquisaController.pesquisar);

module.exports = router;