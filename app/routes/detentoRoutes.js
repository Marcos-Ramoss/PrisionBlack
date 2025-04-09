const express = require('express');
const router = express.Router();
const DetentoController = require('../controllers/DetentoController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const session = require('../middlewares/autenticate');
const multerConfig = require('../config/multerConfig');
const validator = require('../middlewares/validator');

// Rota para renderizar o formulário de cadastro
router.get('/cadastro', authenticate, authorize('DIRETOR', 'INSPETOR','ADMIN'), session, DetentoController.cadastrar);

// Rota para cadastrar um novo detento
router.post('/cadastro', authenticate, authorize('ADMIN', 'DIRETOR', 'INSPETOR'), multerConfig, session, DetentoController.cadastrar);

router.get('/lista', authenticate, authorize('ADMIN', 'DIRETOR', 'INSPETOR'), session, DetentoController.listar);

router.get('/pesquisar', DetentoController.pesquisar);

router.get('/:id/editar',authenticate, authorize('ADMIN', 'DIRETOR','INSPETOR'), session, DetentoController.editar);

router.post('/:id/editar', authenticate, authorize('ADMIN', 'DIRETOR','INSPETOR'), session, multerConfig, DetentoController.atualizar);

router.get('/:id/excluir', authenticate, authorize('ADMIN', 'DIRETOR','INSPETOR'), session, DetentoController.excluir);

// Rota para exibir detalhes de um detento
router.get('/:id', authenticate, authorize('ADMIN', 'DIRETOR', 'INSPETOR'), session, DetentoController.detalhes);

module.exports = router;