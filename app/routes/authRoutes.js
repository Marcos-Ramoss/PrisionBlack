const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.get('/', (req, res) => {
  res.render('home', { user: req.session.user }); // Renderiza a página principal
});

router.post('/auth/login', AuthController.login);

router.post('/register', AuthController.registrar);

router.get('/logout', AuthController.logout);

router.get('/sobre-nos', (req, res) => {
  res.render('sobre-nos'); // Renderiza a view "sobre-nos.ejs"
});

module.exports = router;