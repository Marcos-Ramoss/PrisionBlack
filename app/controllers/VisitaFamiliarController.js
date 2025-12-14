const VisitaFamiliarService = require('../services/VisitaFamiliarService');
const DetentoService = require('../services/DetentoService');
const VisitaFamiliarDTO = require('../dtos/VisitaFamiliarDTO');

class VisitaFamiliarController {
  static async listar(req, res, next) {
    try {
      const visitas = await VisitaFamiliarService.listar();
      res.render('visitas/lista', {
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
        return await VisitaFamiliarController.exibirFormularioCadastro(req, res);
      }
      
      if (req.method === 'POST') {
        return await VisitaFamiliarController.processarCadastro(req, res);
      }
    } catch (erro) {
      next(erro);
    }
  }

  static async exibirFormularioCadastro(req, res) {
    const detentos = await DetentoService.listar();
    res.render('visitas/cadastro', {
      detentos,
      user: req.session.user,
      currentPage: 'visitas'
    });
  }

  static async processarCadastro(req, res) {
    const visitaFamiliarDTO = VisitaFamiliarController.criarDTODoRequest(req);
    await VisitaFamiliarService.cadastrar(visitaFamiliarDTO);
    res.redirect('/visitas/lista');
  }

  static criarDTODoRequest(req) {
    const { detentoId, nomeFamiliar, relacao, dataVisita, horaVisita, observacoes } = req.body;
    
    return new VisitaFamiliarDTO({
      detentoId,
      nomeFamiliar,
      relacao,
      dataVisita: dataVisita ? new Date(dataVisita) : null,
      horaVisita: horaVisita || '',
      observacoes: observacoes || ''
    });
  }

  static async editar(req, res, next) {
    try {
      if (req.method === 'GET') {
        return await VisitaFamiliarController.exibirFormularioEdicao(req, res);
      }
      
      if (req.method === 'POST') {
        return await VisitaFamiliarController.processarEdicao(req, res);
      }
    } catch (erro) {
      next(erro);
    }
  }

  static async exibirFormularioEdicao(req, res) {
    const { id } = req.params;
    const visita = await VisitaFamiliarService.buscarPorId(id);
    const detentos = await DetentoService.listar();
    
    res.render('visitas/editar', {
      visita,
      detentos,
      user: req.session.user,
      currentPage: 'visitas'
    });
  }

  static async processarEdicao(req, res) {
    const { id } = req.params;
    const visitaFamiliarDTO = VisitaFamiliarController.criarDTODoRequest(req);
    await VisitaFamiliarService.editar(id, visitaFamiliarDTO);
    res.redirect('/visitas/lista');
  }

  static async listarPorData(req, res, next) {
    try {
      const { dataInicio, dataFim } = req.query;
      const visitas = await VisitaFamiliarService.listarPorData(
        new Date(dataInicio),
        new Date(dataFim)
      );
      
      res.render('visitas/listaPorData', {
        visitas,
        user: req.session.user,
        currentPage: 'visitas'
      });
    } catch (erro) {
      next(erro);
    }
  }

  static async excluir(req, res, next) {
    try {
      const { id } = req.params;
      await VisitaFamiliarService.excluir(id);
      res.redirect('/visitas/lista');
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = VisitaFamiliarController;
