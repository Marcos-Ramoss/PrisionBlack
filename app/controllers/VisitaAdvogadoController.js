const VisitaAdvogadoService = require('../services/VisitaAdvogadoService');
const DetentoService = require('../services/DetentoService');
const VisitaAdvogadoDTO = require('../dtos/VisitaAdvogadoDTO');
const moment = require('moment-timezone');

class VisitaAdvogadoController {
  static async listar(req, res, next) {
    try {
      const visitas = await VisitaAdvogadoService.listar();
      res.render('visitasAdvogado/lista', {
        visitas,
        user: req.session.user,
        currentPage: 'visitas'
      });
    } catch (erro) {
      next(erro);
    }
  }

  static async cadastrar(req, res, next) {
    try {
      if (req.method === 'GET') {
        return await VisitaAdvogadoController.exibirFormularioCadastro(req, res);
      }
      
      if (req.method === 'POST') {
        return await VisitaAdvogadoController.processarCadastro(req, res);
      }
    } catch (erro) {
      next(erro);
    }
  }

  static async exibirFormularioCadastro(req, res) {
    const detentos = await DetentoService.listar();
    res.render('visitasAdvogado/cadastro', {
      detentos,
      user: req.session.user,
      currentPage: 'visitas'
    });
  }

  static async processarCadastro(req, res) {
    const visitaAdvogadoDTO = VisitaAdvogadoController.criarDTODoRequest(req);
    await VisitaAdvogadoService.cadastrar(visitaAdvogadoDTO);
    res.redirect('/visitasAdvogado/lista');
  }

  static criarDTODoRequest(req) {
    const { detentoId, nomeAdvogado, numeroOAB, dataVisita, horaVisita, observacoes } = req.body;
    
    const dataVisitaAmazonas = dataVisita 
      ? moment.tz(dataVisita, 'America/Manaus').toDate()
      : null;
    
    return new VisitaAdvogadoDTO({
      detentoId,
      nomeAdvogado,
      numeroOAB,
      dataVisita: dataVisitaAmazonas,
      horaVisita: horaVisita || '',
      observacoes: observacoes || ''
    });
  }

  static async editar(req, res, next) {
    try {
      if (req.method === 'GET') {
        return await VisitaAdvogadoController.exibirFormularioEdicao(req, res);
      }
      
      if (req.method === 'POST') {
        return await VisitaAdvogadoController.processarEdicao(req, res);
      }
    } catch (erro) {
      next(erro);
    }
  }

  static async exibirFormularioEdicao(req, res) {
    const { id } = req.params;
    const visita = await VisitaAdvogadoService.buscarPorId(id);
    const detentos = await DetentoService.listar();
    
    res.render('visitasAdvogado/editar', {
      visita,
      detentos,
      user: req.session.user,
      currentPage: 'visitas'
    });
  }

  static async processarEdicao(req, res) {
    const { id } = req.params;
    const visitaAdvogadoDTO = VisitaAdvogadoController.criarDTODoRequest(req);
    await VisitaAdvogadoService.editar(id, visitaAdvogadoDTO);
    res.redirect('/visitasAdvogado/lista');
  }

  static async excluir(req, res, next) {
    try {
      const { id } = req.params;
      await VisitaAdvogadoService.excluir(id);
      res.redirect('/visitasAdvogado/lista');
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = VisitaAdvogadoController;
