const CelaModel = require('../models/CelaModel');

class RelatorioController {
  static async ocupacao(req, res) {
    try {
      const celas = await CelaModel.find().populate('ocupantes');
      res.render('relatorios/ocupacao', { celas });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = RelatorioController;