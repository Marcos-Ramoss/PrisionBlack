const PesquisaService = require('../services/PesquisaService');

class PesquisaController {

  static async pesquisar(req, res) {
    try {
      const query = req.query.query; // Captura o termo de pesquisa
      if (!query) {
        return res.status(400).send('Termo de pesquisa inválido.');
      }

      const resultado = PesquisaService.determinarFuncionalidade(query);
   
      if (resultado.redirect) {
        req.flash('success', resultado.mensagem);
        return res.redirect(resultado.redirect);
      }
      
      req.flash('error', resultado.mensagem);
      res.redirect('/');
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = PesquisaController;