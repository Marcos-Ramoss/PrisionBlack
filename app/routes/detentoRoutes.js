const express = require('express');
const router = express.Router();
const DetentoController = require('../controllers/DetentoController');
const authMiddleware = require('../middlewares/authMiddleware');
const multerConfig = require('../config/multerConfig');

router.get('/cadastro', authMiddleware, (req, res) => {
  res.render('detentos/cadastro',  { user: req.session.user });
});

router.post('/cadastro', multerConfig, DetentoController.cadastrar);

router.get('/lista', authMiddleware, DetentoController.listar);

router.get('/pesquisar', DetentoController.pesquisar);

router.get('/:id/editar', DetentoController.editar);

router.post('/:id/editar', multerConfig, DetentoController.atualizar);

router.get('/:id/excluir', DetentoController.excluir);

// Rota para exibir detalhes de um detento
router.get('/:id', DetentoController.detalhes);

module.exports = router;