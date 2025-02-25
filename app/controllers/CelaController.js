const DetentoService = require('../services/DetentoService');

class DetentoController {
  static async cadastrar(req, res) {
    try {
      const { nome, idade, filiacao, estadoCivil, reincidencia, crimes } = req.body;
      const file = req.file; // Arquivo enviado pelo formulário

      const novoDetento = await DetentoService.cadastrar(
        { nome, idade, filiacao, estadoCivil, reincidencia, crimes },
        file
      );

      res.status(201).render('detentos/detalhes', { detento: novoDetento });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  static async listar(req, res) {
    try {
      const detentos = await DetentoService.listar();
      res.render('detentos/lista', { detentos });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = DetentoController;