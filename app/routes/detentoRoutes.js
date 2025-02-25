const express = require('express');
const router = express.Router();
const DetentoController = require('../controllers/DetentoController');
const authMiddleware = require('../middlewares/authMiddleware');
const multerConfig = require('../config/multerConfig');

router.get('/cadastro', authMiddleware, (req, res) => {
  res.render('detentos/cadastro',  { user: req.session.user });
});

router.post('/cadastro', multerConfig.single('foto'), DetentoController.cadastrar);

router.get('/lista', authMiddleware, DetentoController.listar);

module.exports = router;