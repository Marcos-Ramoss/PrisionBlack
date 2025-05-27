const express = require('express');
const router = express.Router();
const CelaController = require('../controllers/CelaController');
const CelaService = require("../services/CelaService")
const DetentoService = require("../services/DetentoService")
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const session = require('../middlewares/autenticate');



router.get('/lista', authenticate, authorize('DIRETOR', 'ADMIN', 'INSPETOR'), session, CelaController.listar);

router.get('/cadastrar', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, async (req, res) => {
  try {
    const detentos = await DetentoService.listar();
    res.render('celas/cadastro', {
      detentos,
      user: req.session.user,
      currentPage: 'celas'
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/cadastrar', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, CelaController.cadastrar);

router.get('/alocar', authenticate, authorize('DIRETOR', 'INSPETOR'), session, async (req, res) => {
  try {
    const celas = await CelaService.listar();
    const detentos = await DetentoService.listar();
    res.render('celas/alocar', {
      celas,
      detentos,
      user: req.session.user,
      currentPage: 'celas'
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/alocar', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, CelaController.alocar);
router.get('/:id/editar', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, CelaController.editar);
router.post('/:id/editar', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, CelaController.editar);
router.get('/:id/excluir', authenticate, authorize('DIRETOR', 'INSPETOR', 'ADMIN'), session, CelaController.excluir);

module.exports = router;