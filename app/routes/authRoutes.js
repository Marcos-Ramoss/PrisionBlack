const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.get('/', (req, res) => {
  res.render('home', { user: req.session.user }); // Renderiza a página principal
});


router.get('/login', (req, res) => {
  res.render('auth/login'); // Renderiza a página de login
});

router.post('/login', AuthController.login);

router.get('/register', (req, res) => {
  res.render('auth/register'); // Renderiza a página de registro
});

router.post('/register', AuthController.register);

router.get('/logout', AuthController.logout);

module.exports = router;