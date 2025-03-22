const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const session = require('../middlewares/autenticate');


router.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

router.get('/home', authenticate, authorize('ADMIN', 'INSPETOR', 'DIRETOR'), session, (req, res) => {
  res.render('home', { user: req.session.user });
});

router.post('/auth/login', AuthController.login);

router.post('/register', AuthController.registrar);

router.get('/logout', AuthController.logout);

router.get('/sobre-nos', (req, res) => {
  res.render('sobre-nos'); 
});

module.exports = router;