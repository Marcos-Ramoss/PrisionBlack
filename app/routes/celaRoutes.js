const express = require('express');
const router = express.Router();
const CelaController = require('../controllers/CelaController');
const CelaService = require("../services/CelaService")
const DetentoService = require("../services/DetentoService")
const { authenticate, authorize } = require('../middlewares/authMiddleware');


router.get('/lista', authenticate, authorize('DIRETOR', 'ADMIN','INSPETOR'), CelaController.listar);

router.get('/cadastrar', authenticate, authorize('DIRETOR','INSPETOR'), async (req, res) => {
    try {
      const detentos = await DetentoService.listar(); // Obtém a lista de detentos
      res.render('celas/cadastro', { detentos, user: req.session.user });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

router.post('/cadastrar', authenticate, authorize('DIRETOR','INSPETOR'), CelaController.cadastrar);

router.get('/alocar', authenticate, authorize('DIRETOR','INSPETOR'), async (req, res) => {
    try {
      const celas = await CelaService.listar();
      const detentos = await DetentoService.listar();
      res.render('celas/alocar', { celas, detentos, user: req.session.user });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

router.post('/alocar', authenticate, authorize('DIRETOR','INSPETOR'), CelaController.alocar);


router.get('/:id/editar', authenticate, authorize('DIRETOR','INSPETOR'), CelaController.editar);


router.post('/:id/editar', authenticate, authorize('DIRETOR','INSPETOR'), CelaController.editar);


router.get('/:id/excluir',authenticate, authorize('DIRETOR','INSPETOR'), CelaController.excluir);



module.exports = router;