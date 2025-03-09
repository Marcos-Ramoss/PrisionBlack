const AlocacaoService = require('../services/AlocacaoService');

class AlocacaoController {
  // Rota para alocar um detento em uma cela
  static async alocar(req, res) {
    try {
      const { celaId, detentoId } = req.body;

      // Chama o serviço para alocar o detento
      const resultado = await AlocacaoService.alocarDetento(celaId, detentoId);

      // Redireciona para a página de detalhes da cela ou exibe uma mensagem de sucesso
      req.flash('success', resultado.mensagem);
      res.redirect(`/celas/${celaId}/detalhes`);
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/celas/lista'); // Redireciona para a lista de celas em caso de erro
    }
  }

  // Rota para remover um detento de uma cela
  static async remover(req, res) {
    try {
      const { celaId, detentoId } = req.params;

      // Chama o serviço para remover o detento
      const resultado = await AlocacaoService.removerDetento(celaId, detentoId);

      // Redireciona para a página de detalhes da cela ou exibe uma mensagem de sucesso
      req.flash('success', resultado.mensagem);
      res.redirect(`/celas/${celaId}/detalhes`);
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/celas/lista'); // Redireciona para a lista de celas em caso de erro
    }
  }

  static async detalhes(req, res) {
    try {
      // Chama o serviço para listar todas as alocações
      const celas = await AlocacaoService.listarAlocacoes();
  
      // Renderiza a página de detalhes de alocação
      res.render('alocacao/detalhes', { celas, user: req.session.user });
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/'); // Redireciona para a página inicial em caso de erro
    }
  }
}

module.exports = AlocacaoController;