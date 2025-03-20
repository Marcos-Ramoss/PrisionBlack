const express = require('express');
const router = express.Router();
const PesquisaController = require('../controllers/PesquisaController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');


// Rota para processar a pesquisa
router.get('/pesquisar',authenticate, authorize('DIRETOR', 'INSPETOR'), PesquisaController.pesquisar);

module.exports = router;