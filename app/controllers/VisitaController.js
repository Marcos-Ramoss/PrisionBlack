const VisitaService = require('../services/VisitaService');

class VisitaController {
  static async registrarVisitaFamiliar(req, res) {
    try {
      const dados = req.body;
      await VisitaService.registrarVisitaFamiliar(dados);
      res.status(200).send('Visita familiar registrada com sucesso.');
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  static async registrarVisitaAdvogado(req, res) {
    try {
      const dados = req.body;
      await VisitaService.registrarVisitaAdvogado(dados);
      res.status(200).send('Visita de advogado registrada com sucesso.');
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
}

module.exports = VisitaController;