const express = require('express');
const router = express.Router();
const CelaController = require('../controllers/CelaController');
const CelaService = require("../services/CelaService")
const DetentoService = require("../services/DetentoService")
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/lista', authMiddleware, CelaController.listar);

router.get('/cadastrar', async (req, res) => {
    try {
      const detentos = await DetentoService.listar(); // Obtém a lista de detentos
      res.render('celas/cadastro', { detentos, user: req.session.user });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

router.post('/cadastrar', CelaController.cadastrar);

router.get('/alocar', async (req, res) => {
    try {
      const celas = await CelaService.listar();
      const detentos = await DetentoService.listar();
      res.render('celas/alocar', { celas, detentos, user: req.session.user });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

router.post('/alocar', CelaController.alocar);


router.get('/:id/editar', CelaController.editar);


router.post('/:id/editar', CelaController.editar);


router.get('/:id/excluir', CelaController.excluir);





module.exports = router;