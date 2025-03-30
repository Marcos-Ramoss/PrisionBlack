const DetentoModel = require('../models/DetentoModel');
const CelaModel = require('../models/CelaModel');
const VisitaFamiliarModel = require('../models/VisitaFamiliarModel');
const VisitaAdvogadoModel = require('../models/VisitaAdvogadoModel');

class DiretorController {
  static async dashboard(req, res) {
    try {
      // Obter estatísticas do sistema
      const totalDetentos = await DetentoModel.countDocuments();
      const totalCelas = await CelaModel.countDocuments();
      const totalCelasOcupadas = await CelaModel.countDocuments({ ocupantes: { $ne: [] } });
      const totalCelasAlocadas = await CelaModel.countDocuments({ 'ocupantes.0': { $exists: true } });
      const totalVisitasFamiliares = await VisitaFamiliarModel.countDocuments();
      const totalVisitasAdvogados = await VisitaAdvogadoModel.countDocuments();

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
      });
    } catch (error) {
      console.error('Erro ao carregar o dashboard:', error.message);
      res.status(500).json({ success: false, error: 'Erro ao carregar o dashboard.' });
    }
  }
}

module.exports = DiretorController; 