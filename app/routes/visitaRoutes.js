const express = require('express');
const router = express.Router();
const VisitaController = require('../controllers/VisitaController');

router.post('/familiares', VisitaController.registrarVisitaFamiliar);
router.post('/advogados', VisitaController.registrarVisitaAdvogado);

module.exports = router;