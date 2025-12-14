const AlocacaoService = require('../services/AlocacaoService');
const DetentoService = require('../services/DetentoService');
const CelaService = require('../services/CelaService');

class AlocacaoController {
  async detalhes(req, res, next) {
    try {
      const detentos = await DetentoService.listar();
      const celas = await CelaService.listar();

      res.render('alocacao/detalhes', {
        detentos,
        celas,
        user: req.session.user,
        currentPage: 'celas'
      });
    } catch (erro) {
      next(erro);
    }
  }

  async alocar(req, res, next) {
    try {
      const { celaId, detentoId } = req.body;
      const resultado = await AlocacaoService.alocarDetento(
        celaId,
        detentoId,
        req.session.user
      );

      res.json({
        success: true,
        message: resultado.mensagem
      });
    } catch (erro) {
      next(erro);
    }
  }

  async remover(req, res, next) {
    try {
      const { celaId, detentoId } = req.params;
      const resultado = await AlocacaoService.removerDetento(celaId, detentoId);

      res.json({
        success: true,
        message: resultado.mensagem
      });
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = new AlocacaoController();
