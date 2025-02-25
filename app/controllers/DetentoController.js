const DetentoService = require('../services/DetentoService');
const multerConfig = require('../config/multerConfig');

class DetentoController {
  static async cadastrar(req, res) {
    try {
      const { nome, idade, filiacao, estadoCivil, reincidencia, crimes } = req.body;
      const foto = req.file ? req.file.filename : null; // Obtém o nome do arquivo da foto

      const novoDetento = await DetentoService.cadastrar({
        nome,
        idade,
        filiacao,
        estadoCivil,
        foto,
        reincidencia: reincidencia === 'true',
        crimes: crimes.split(',').map((crime) => crime.trim()) // Divide crimes em array
      });

      res.status(201).render('detentos/detalhes', { detento: novoDetento });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  static async listar(req, res) {
    try {
      const detentos = await DetentoService.listar();
      res.render('detentos/lista', { detentos, user: req.session.user });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = DetentoController;