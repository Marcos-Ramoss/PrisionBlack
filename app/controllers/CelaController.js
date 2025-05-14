const CelaService = require('../services/CelaService');
const DetentoService = require('../services/DetentoService');

class CelaController {
  static async listar(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const search = req.query.search || '';
      const pavilhao = req.query.pavilhao || '';
      const ocupacao = req.query.ocupacao || '';
      const { celas, total, totalPages } = await CelaService.listarPaginado(page, limit, search, pavilhao, ocupacao);
      res.render('celas/lista', {
        celas,
        user: req.session.user,
        page,
        totalPages,
        total,
        limit,
        search,
        pavilhao,
        ocupacao
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async cadastrar(req, res) {
    try {
      const { codigo, pavilhao, capacidade } = req.body;
      const novaCela = await CelaService.cadastrar({ codigo, pavilhao, capacidade });
      return res.status(201).json({
        success: true,
        message: 'Cela cadastrada com sucesso!',
        data: novaCela,
      }); 
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
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