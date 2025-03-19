const express = require('express');
const router = express.Router();
const DetentoController = require('../controllers/DetentoController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const multerConfig = require('../config/multerConfig');

router.get('/cadastro', (req, res) => {
  res.render('detentos/cadastro',  { user: req.session.user });
});

router.post('/cadastro',authenticate, authorize('ADMIN', 'DIRETOR'), multerConfig, DetentoController.cadastrar);

router.get('/lista', authenticate, authorize('ADMIN', 'DIRETOR', 'INSPETOR'), DetentoController.listar);

router.get('/pesquisar', DetentoController.pesquisar);

router.get('/:id/editar',authenticate, authorize('ADMIN', 'DIRETOR'), DetentoController.editar);

router.post('/:id/editar', authenticate, authorize('ADMIN', 'DIRETOR'), multerConfig, DetentoController.atualizar);

router.get('/:id/excluir', authenticate, authorize('ADMIN', 'DIRETOR'), DetentoController.excluir);

// Rota para exibir detalhes de um detento
router.get('/:id', authenticate, authorize('ADMIN', 'DIRETOR', 'INSPETOR'), DetentoController.detalhes);

module.exports = router;