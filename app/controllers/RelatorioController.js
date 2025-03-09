const RelatorioService = require('../services/RelatorioService');

class RelatorioController {
  static async ocupacao(req, res) {
    try {
      const celas = await RelatorioService.gerarOcupacao();
      res.render('relatorios/ocupacao', { celas, user: req.session.user });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async saidas(req, res) {
    try {
      const detentosSaidos = await RelatorioService.gerarSaidas();
      res.render('relatorios/saidas', { detentosSaidos, user: req.session.user });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = RelatorioController;