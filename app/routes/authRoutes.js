const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const session = require('../middlewares/autenticate');
const UserModel = require('../models/UserModel');


router.get('/check-users', async (req, res) => {
  try {
    const users = await UserModel.find({}, 'nome email nivelAcesso');
    console.log('Usuários existentes:', users);
    res.json({ users });
  } catch (error) {
    console.error('Erro ao verificar usuários:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/clear-users', async (req, res) => {
  try {
    await UserModel.deleteMany({});
    console.log('Todos os usuários foram removidos');
    res.json({ message: 'Usuários removidos com sucesso' });
  } catch (error) {
    console.error('Erro ao limpar usuários:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

router.get('/home', authenticate, authorize('ADMIN', 'INSPETOR', 'DIRETOR'), (req, res) => {
  console.log('Renderizando página home para usuário:', req.session.user);
  res.render('home', { 
    user: req.session.user,
    currentPage: 'home'
  });
});

router.post('/auth/login', AuthController.login);
router.post('/register', AuthController.registrar);
router.get('/logout', AuthController.logout);
router.get('/sobre-nos', authenticate, authorize('ADMIN', 'INSPETOR', 'DIRETOR'), (req, res) => {
  res.render('sobre-nos', { user: req.session.user }); 
});

module.exports = router;