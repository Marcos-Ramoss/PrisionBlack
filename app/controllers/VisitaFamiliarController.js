const VisitaFamiliarService = require('../services/VisitaFamiliarService');
const DetentoService = require('../services/DetentoService');

class VisitaFamiliarController {
  static async listar(req, res) {
    try {
      const visitas = await VisitaFamiliarService.listar();
      res.render('visitas/lista', { 
        visitas, 
        user: req.session.user,
        currentPage: 'visitas'
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async cadastrar(req, res) {
    try {
      if (req.method === 'GET') {
        // Renderiza o formulário de cadastro com a lista de detentos
        const detentos = await DetentoService.listar();
        res.render('visitas/cadastro', { 
          detentos, 
          user: req.session.user,
          currentPage: 'visitas'
        });
      } else if (req.method === 'POST') {
        // Cadastra uma nova visita
        const { detentoId, nomeFamiliar, relacao, dataVisita, observacoes } = req.body;
        const novaVisita = await VisitaFamiliarService.cadastrar({
          detento: detentoId,
          nomeFamiliar,
          relacao,
          dataVisita: new Date(dataVisita),
          observacoes
        });
        res.redirect('/visitas/lista'); // Redireciona para a lista de visitas
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async editar(req, res) {
    try {
      const { id } = req.params;

      if (req.method === 'GET') {
        // Renderiza o formulário de edição com os dados da visita
        const visita = await VisitaFamiliarService.buscarPorId(id);
        const detentos = await DetentoService.listar();
        if (!visita) return res.status(404).send('Visita não encontrada.');
        res.render('visitas/editar', { visita, detentos, user: req.session.user });
      } else if (req.method === 'POST') {
        // Atualiza a visita com os novos dados
        const { nomeFamiliar, relacao, dataVisita, observacoes } = req.body;
        const dadosAtualizados = { nomeFamiliar, relacao, dataVisita: new Date(dataVisita), observacoes };
        const visitaAtualizada = await VisitaFamiliarService.editar(id, dadosAtualizados);
        if (!visitaAtualizada) return res.status(404).send('Visita não encontrada.');
        res.redirect('/visitas/lista'); // Redireciona para a lista de visitas
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async listarPorData(req, res) {
    try {
      const { dataInicio, dataFim } = req.query;
      const visitas = await VisitaFamiliarService.listarPorData(new Date(dataInicio), new Date(dataFim));
      res.render('visitas/listaPorData', { 
        visitas, 
        user: req.session.user,
        currentPage: 'visitas'
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async excluir(req, res) {
    try {
      const { id } = req.params;
  
      
      await VisitaFamiliarService.excluir(id);
      res.redirect('/visitas/lista');
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = VisitaFamiliarController;