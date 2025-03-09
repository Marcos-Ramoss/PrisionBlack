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
      req.flash('success', 'Cadastro realizado com sucesso!');
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

  static async detalhes(req, res) {
    try {
      const { id } = req.params;
      const detento = await DetentoService.buscarPorId(id);
      if (!detento) return res.status(404).send('Detento não encontrado.');
      res.render('detentos/detalhes', { detento, user: req.session.user });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async editar(req, res) {
    try {
      const { id } = req.params;
      const detento = await DetentoService.buscarPorId(id);
      if (!detento) return res.status(404).send('Detento não encontrado.');

      
      res.render('detentos/editar', { detento, user: req.session.user });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizados = req.body;

      const detentoAtualizado = await DetentoService.atualizar(id, dadosAtualizados);
      if (!detentoAtualizado) return res.status(404).send('Detento não encontrado.');

      res.redirect('/detentos/lista');
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async excluir(req, res) {
    try {
      const { id } = req.params;

      await DetentoService.excluir(id);
      res.redirect('/detentos/lista');
    } catch (error) {
      res.status(500).send(error.message);
    }
}

  static async pesquisar(req, res) {
    try {
      const { nome } = req.query;
      const detentos = await DetentoService.pesquisarPorNome(nome);
  
      res.json(detentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports = DetentoController;