const VisitaAdvogadoService = require('../services/VisitaAdvogadoService');
const DetentoService = require('../services/DetentoService');
const moment = require('moment-timezone');

class VisitaAdvogadoController {
  static async listar(req, res) {
    try {
      const visitas = await VisitaAdvogadoService.listar();
      res.render('visitasAdvogado/lista', { 
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
        res.render('visitasAdvogado/cadastro', { 
          detentos, 
          user: req.session.user,
          currentPage: 'visitas'
        });
      } else if (req.method === 'POST') {
        // Cadastra uma nova visita
        const { detentoId, nomeAdvogado, numeroOAB, dataVisita, observacoes } = req.body;
        const dataVisitaAmazonas = moment.tz(dataVisita, 'America/Manaus').toDate();
        const novaVisita = await VisitaAdvogadoService.cadastrar({
          detento: detentoId,
          nomeAdvogado,
          numeroOAB,
          dataVisita: dataVisitaAmazonas,
          observacoes
        });
        res.redirect('/visitasAdvogado/lista'); // Redireciona para a lista de visitas
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
        const visita = await VisitaAdvogadoService.buscarPorId(id);
        const detentos = await DetentoService.listar();
        if (!visita) return res.status(404).send('Visita não encontrada.');
        res.render('visitasAdvogado/editar', { 
          visita, 
          detentos, 
          user: req.session.user,
          currentPage: 'visitas'
        });
      } else if (req.method === 'POST') {
        // Atualiza a visita com os novos dados
        const { detentoId, nomeAdvogado, numeroOAB, dataVisita, observacoes } = req.body;
        const dataVisitaAmazonas = moment.tz(dataVisita, 'America/Manaus').toDate();
        const dadosAtualizados = {
          detento: detentoId,
          nomeAdvogado,
          numeroOAB,
          dataVisita: dataVisitaAmazonas,
          observacoes
        };
        const visitaAtualizada = await VisitaAdvogadoService.editar(id, dadosAtualizados);
        if (!visitaAtualizada) return res.status(404).send('Visita não encontrada.');
        res.redirect('/visitasAdvogado/lista'); // Redireciona para a lista de visitas
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async excluir(req, res) {
    try {
      const { id } = req.params;

      // Exclui a visita pelo ID
      await VisitaAdvogadoService.excluir(id);

      // Redireciona para a lista de visitas após a exclusão
      res.redirect('/visitasAdvogado/lista');
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = VisitaAdvogadoController;