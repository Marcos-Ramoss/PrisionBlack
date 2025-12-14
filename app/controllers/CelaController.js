const CelaService = require('../services/CelaService');
const DetentoService = require('../services/DetentoService');
const CelaDTO = require('../dtos/CelaDTO');

class CelaController {
  static async listar(req, res, next) {
    try {
      const { page, limit, search, pavilhao, ocupacao } = CelaController.extrairParametrosListagem(req);
      const resultado = await CelaService.listarPaginado(
        page, limit, search, pavilhao, ocupacao
      );
      
      res.render('celas/lista', {
        celas: resultado.celas,
        user: req.session.user,
        page: resultado.page,
        totalPages: resultado.totalPages,
        total: resultado.total,
        limit,
        search,
        pavilhao,
        ocupacao,
        currentPage: 'celas'
      });
    } catch (erro) {
      next(erro);
    }
  }

  static extrairParametrosListagem(req) {
    return {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 5,
      search: req.query.search || '',
      pavilhao: req.query.pavilhao || '',
      ocupacao: req.query.ocupacao || ''
    };
  }

  static async cadastrar(req, res, next) {
    try {
      const celaDTO = CelaController.criarDTODoRequest(req);
      const novaCela = await CelaService.cadastrar(celaDTO);
      
      return res.status(201).json({
        success: true,
        message: 'Cela cadastrada com sucesso!',
        data: novaCela
      });
    } catch (erro) {
      next(erro);
    }
  }

  static criarDTODoRequest(req) {
    const { codigo, pavilhao, capacidade } = req.body;
    return new CelaDTO({
      codigo,
      pavilhao,
      capacidade: parseInt(capacidade)
    });
  }

  static async alocar(req, res, next) {
    try {
      const { celaId, detentoId } = req.body;
      await CelaService.alocar(celaId, detentoId);
      res.redirect('/celas/lista');
    } catch (erro) {
      next(erro);
    }
  }

  static async editar(req, res, next) {
    try {
      if (req.method === 'GET') {
        return await CelaController.exibirFormularioEdicao(req, res);
      }
      
      if (req.method === 'POST') {
        return await CelaController.processarEdicao(req, res);
      }
    } catch (erro) {
      next(erro);
    }
  }

  static async exibirFormularioEdicao(req, res) {
    const { id } = req.params;
    const cela = await CelaService.buscarPorId(id);
    
    res.render('celas/editar', {
      cela,
      user: req.session.user,
      currentPage: 'celas'
    });
  }

  static async processarEdicao(req, res) {
    const { id } = req.params;
    const celaDTO = CelaController.criarDTODoRequest(req);
    await CelaService.editar(id, celaDTO);
    res.redirect('/celas/lista');
  }

  static async excluir(req, res, next) {
    try {
      const { id } = req.params;
      await CelaService.excluir(id);
      res.redirect('/celas/lista');
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = CelaController;
