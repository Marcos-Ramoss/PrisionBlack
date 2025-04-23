const DetentoModel = require('../models/DetentoModel');
const CelaModel = require('../models/CelaModel');
const VisitaFamiliarModel = require('../models/VisitaFamiliarModel');
const VisitaAdvogadoModel = require('../models/VisitaAdvogadoModel');

class DiretorController {
  static async dashboard(req, res) {
    try {
      const { pavilhao } = req.query;
  
      const totalDetentos = await DetentoModel.countDocuments();
      const totalCelas = await CelaModel.countDocuments();
      const totalCelasOcupadas = await CelaModel.countDocuments({ 'ocupantes.0': { $exists: true } });
      const totalCelasAlocadas = await CelaModel.countDocuments({ 'ocupantes.0': { $exists: true } });
      const totalVisitasFamiliares = await VisitaFamiliarModel.countDocuments();
      const totalVisitasAdvogados = await VisitaAdvogadoModel.countDocuments();

      const celasPorPavilhao = await CelaModel.aggregate([
        { $group: { _id: "$pavilhao", total: { $sum: 1 } } }
      ]);

      let celasFiltradas = [];
      if (pavilhao) {
        celasFiltradas = await CelaModel.find({ pavilhao }).populate('ocupantes', 'nome');
      }

      const celasOcupadas = await CelaModel.find({ 'ocupantes.0': { $exists: true } });
      console.log('Detalhes das Celas Ocupadas:', celasOcupadas);

      // Verificar se a requisição é via fetch (AJAX)
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ celasFiltradas });
      }

      console.log('Total de Celas Ocupadas:', totalCelasOcupadas);

      // Renderizar a view do dashboard com os dados
      res.render('diretor/dashboard', {
        title: 'Dashboard do Diretor',
        user: req.usuario,
        totalDetentos,
        totalCelas,
        totalCelasOcupadas,
        totalCelasAlocadas,
        totalCelasDisponiveis: totalCelas - totalCelasOcupadas,
        totalVisitasFamiliares,
        totalVisitasAdvogados,
        celasPorPavilhao,
        celasFiltradas,
        pavilhaoSelecionado: pavilhao || null,
      });
    } catch (error) {
      console.error('Erro ao carregar o dashboard:', error.message);
      res.status(500).json({ success: false, error: 'Erro ao carregar o dashboard.' });
    }
  }
}

module.exports = DiretorController; 