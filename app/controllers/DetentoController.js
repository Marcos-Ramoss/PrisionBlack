const DetentoService = require('../services/DetentoService');
const CelaService = require('../services/CelaService');
const DetentoDTO = require('../dtos/DetentoDTO');
const multerConfig = require('../config/multerConfig');

class DetentoController {
  static async cadastrar(req, res, next) {
    try {
      if (req.method === 'GET') {
        return await DetentoController.exibirFormularioCadastro(req, res);
      }
      
      if (req.method === 'POST') {
        return await DetentoController.processarCadastro(req, res);
      }
    } catch (erro) {
      next(erro);
    }
  }

  static async exibirFormularioCadastro(req, res) {
    const celas = await CelaService.listar();
    res.render('detentos/cadastro', {
      celas,
      user: req.session.user,
      error: null,
      currentPage: 'detentos'
    });
  }

  static async processarCadastro(req, res) {
    const detentoDTO = DetentoController.criarDTODoRequest(req);
    await DetentoService.cadastrar(detentoDTO);
    res.redirect('/detentos/lista');
  }

  static criarDTODoRequest(req) {
    const { nome, idade, filiacao, estadoCivil, reincidencia, crimes, cela } = req.body;
    const foto = req.file ? req.file.filename : null;
    const usuarioAtual = req.session.user ? req.session.user.nome : 'Sistema';

    return new DetentoDTO({
      nome,
      idade: parseInt(idade),
      filiacao,
      estadoCivil,
      foto,
      reincidencia: reincidencia === 'true',
      crimes: crimes ? crimes.split(',').map(crime => crime.trim()) : [],
      celaId: cela || null,
      registradoPor: usuarioAtual,
      usuarioCadastro: usuarioAtual,
      comAlocacaoInicial: !!cela
    });
  }

  static async listar(req, res, next) {
    try {
      const { page, limit, search, pavilhao, reincidencia } = DetentoController.extrairParametrosListagem(req);
      const resultado = await DetentoService.listarPaginado(
        page, limit, search, pavilhao, reincidencia
      );
      
      res.render('detentos/lista', {
        detentos: resultado.detentos,
        user: req.session.user,
        page: resultado.page,
        totalPages: resultado.totalPages,
        total: resultado.total,
        limit,
        search,
        pavilhao,
        reincidencia,
        currentPage: 'detentos'
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
      reincidencia: req.query.reincidencia || ''
    };
  }

  static async detalhes(req, res, next) {
    try {
      const { id } = req.params;
      const detento = await DetentoService.buscarPorId(id);
      
      res.render('detentos/detalhes', {
        detento,
        user: req.session.user,
        currentPage: 'detentos'
      });
    } catch (erro) {
      next(erro);
    }
  }

  static async editar(req, res, next) {
    try {
      const { id } = req.params;
      const detento = await DetentoService.buscarPorId(id);
      
      res.render('detentos/editar', {
        detento,
        user: req.session.user,
        currentPage: 'detentos'
      });
    } catch (erro) {
      next(erro);
    }
  }

  static async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const detentoDTO = DetentoController.criarDTOAtualizacao(req);
      await DetentoService.atualizar(id, detentoDTO);
      res.redirect('/detentos/lista');
    } catch (erro) {
      next(erro);
    }
  }

  static criarDTOAtualizacao(req) {
    const { nome, idade, filiacao, estadoCivil, reincidencia, crimes } = req.body;
    const foto = req.file ? req.file.filename : undefined;

    return new DetentoDTO({
      nome,
      idade: parseInt(idade),
      filiacao,
      estadoCivil,
      foto,
      reincidencia: reincidencia === 'true',
      crimes: crimes ? crimes.split(',').map(crime => crime.trim()) : []
    });
  }

  static async excluir(req, res, next) {
    try {
      const { id } = req.params;
      await DetentoService.excluir(id);
      res.redirect('/detentos/lista');
    } catch (erro) {
      next(erro);
    }
  }

  static async pesquisar(req, res, next) {
    try {
      const { nome } = req.query;
      const detentos = await DetentoService.pesquisarPorNome(nome);
      res.json(detentos);
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = DetentoController;

