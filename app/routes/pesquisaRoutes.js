const express = require('express');
const router = express.Router();
const PesquisaController = require('../controllers/PesquisaController');
const authMiddleware = require('../middlewares/authMiddleware');


// Rota para processar a pesquisa
router.get('/pesquisar',authMiddleware, PesquisaController.pesquisar);

module.exports = router;