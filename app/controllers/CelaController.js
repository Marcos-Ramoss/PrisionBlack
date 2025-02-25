const CelaService = require('../services/CelaService');

class CelaController {
  static async alocaDetento(req, res) {
    try {
      const { codigoCela, idDetento } = req.body;
      await CelaService.alocarDetento(codigoCela, idDetento);
      res.status(200).send('Detento alocado com sucesso.');
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  static async transferirDetento(req, res) {
    try {
      const { idDetento, novoCodigoCela } = req.body;
      await CelaService.transferirDetento(idDetento, novoCodigoCela);
      res.status(200).send('Detento transferido com sucesso.');
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
}

module.exports = CelaController;