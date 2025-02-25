const express = require('express');
const router = express.Router();
const CelaController = require('../controllers/CelaController');

router.post('/alocar', CelaController.alocaDetento);
router.post('/transferir', CelaController.transferirDetento);

module.exports = router;