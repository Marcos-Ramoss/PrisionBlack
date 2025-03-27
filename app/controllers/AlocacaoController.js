const AlocacaoService = require('../services/AlocacaoService');
const Detento = require('../models/DetentoModel');
const Cela = require('../models/CelaModel');

class AlocacaoController {
  // Exibir página de detalhes de alocação
  async detalhes(req, res) {
    try {
      const detentos = await Detento.find().populate('cela');
      const celas = await Cela.find();

      res.render('alocacao/detalhes', {
        detentos,
        celas,
        user: req.user
      });
    } catch (error) {
      console.error('Erro ao carregar dados de alocação:', error);
      res.status(500).send('Erro ao carregar dados de alocação');
    }
  }

  // Rota para alocar um detento em uma cela
  async alocar(req, res) {
    try {
      const { celaId, detentoId } = req.body;

      // Chama o serviço para alocar o detento
      const resultado = await AlocacaoService.alocarDetento(celaId, detentoId);

      // Retorna resposta JSON
      res.json({ 
        success: true, 
        message: resultado.mensagem 
      });
    } catch (error) {
      console.error('Erro ao alocar detento:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Rota para remover um detento de uma cela
  async remover(req, res) {
    try {
      const { celaId, detentoId } = req.params;

      // Chama o serviço para remover o detento
      const resultado = await AlocacaoService.removerDetento(celaId, detentoId);

      // Retorna resposta JSON
      res.json({ 
        success: true, 
        message: resultado.mensagem 
      });
    } catch (error) {
      console.error('Erro ao remover detento:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

module.exports = new AlocacaoController();