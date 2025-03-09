const CelaService = require('../services/CelaService');
const DetentoService = require('../services/DetentoService');

class CelaController {
  static async listar(req, res) {
    try {
      const celas = await CelaService.listar();
      res.render('celas/lista', { celas, user: req.session.user });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async cadastrar(req, res) {
    try {
      const { codigo, pavilhao, capacidade, ocupantes } = req.body;
      const ocupantesArray = Array.isArray(ocupantes) ? ocupantes : [ocupantes];
      const novaCela = await CelaService.cadastrar({ codigo, pavilhao, capacidade,  ocupantes: ocupantesArray });
      res.redirect('/celas/lista'); 
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  static async alocar(req, res) {
    try {
      const { celaId, detentoId } = req.body;
      const celaAtualizada = await CelaService.alocar(celaId, detentoId);
      res.redirect('/celas/lista'); 
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  static async editar(req, res) {
    try {
      const { id } = req.params;

      if (req.method === 'GET') {
        // Renderiza o formulário de edição com os dados da cela
        const cela = await CelaService.buscarPorId(id);
        if (!cela) return res.status(404).send('Cela não encontrada.');
        res.render('celas/editar', { cela, user: req.session.user });
      } else if (req.method === 'POST') {
        // Atualiza a cela com os novos dados
        const { codigo, pavilhao, capacidade } = req.body;
        const dadosAtualizados = { codigo, pavilhao, capacidade };
        const celaAtualizada = await CelaService.editar(id, dadosAtualizados);
        if (!celaAtualizada) return res.status(404).send('Cela não encontrada.');
        res.redirect('/celas/lista'); // Redireciona para a lista de celas
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async excluir(req, res) {
    try {
      const { id } = req.params;
      await CelaService.excluir(id);

      res.redirect('/celas/lista');
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

}
module.exports = CelaController;