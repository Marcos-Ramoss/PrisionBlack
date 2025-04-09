const RelatorioService = require('../services/RelatorioService');
const DetentoModel = require('../models/DetentoModel');
const CelaModel = require('../models/CelaModel');
const VisitaFamiliarModel = require('../models/VisitaFamiliarModel');
const VisitaAdvogadoModel = require('../models/VisitaAdvogadoModel');

class RelatorioController {
  static async ocupacao(req, res) {
    try {
      // Buscar todas as celas com seus ocupantes
      const celas = await CelaModel.find().populate('ocupantes');

      // Calcular estatísticas gerais
      const totalDetentos = await DetentoModel.countDocuments();
      const totalCelas = await CelaModel.countDocuments();
      const celasOcupadas = await CelaModel.countDocuments({ 'ocupantes.0': { $exists: true } });
      
      // Calcular taxa de ocupação
      const taxaOcupacao = Math.round((celasOcupadas / totalCelas) * 100);

      // Calcular taxa de reincidência
      const detentosReincidentes = await DetentoModel.countDocuments({ reincidente: true });
      const percentualReincidencia = Math.round((detentosReincidentes / totalDetentos) * 100);

      // Buscar todos os detentos com informações completas
      const detentos = await DetentoModel.find()
        .populate('cela')
        .lean();

      // Calcular média de tempo de detenção (em meses)
      const mediaTempoDetencao = await calcularMediaTempoDetencao(detentos);

      // Buscar pavilhões únicos
      const pavilhoes = [...new Set(celas.map(cela => cela.pavilhao))];

      // Calcular média de visitas por mês
      const visitasPorDetento = await calcularVisitasPorDetento();

      // Renderizar a view com todas as estatísticas
      res.render('relatorios/ocupacao', {
        user: req.session.user,
        celas,
        detentos,
        totalDetentos,
        taxaOcupacao,
        percentualReincidencia,
        mediaTempoDetencao,
        pavilhoes,
        visitasPorDetento
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      res.status(500).send('Erro ao gerar relatório');
    }
  }

  static async saidas(req, res) {
    try {
      const detentosSaidos = await RelatorioService.gerarSaidas();
      res.render('relatorios/saidas', { detentosSaidos, user: req.session.user });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

// Função auxiliar para calcular média de tempo de detenção
async function calcularMediaTempoDetencao(detentos) {
  if (!detentos.length) return 0;
  
  const tempoTotal = detentos.reduce((acc, detento) => {
    const entrada = new Date(detento.dataEntrada);
    const hoje = new Date();
    const diffMeses = (hoje - entrada) / (1000 * 60 * 60 * 24 * 30); // Aproximação em meses
    return acc + diffMeses;
  }, 0);

  return Math.round(tempoTotal / detentos.length);
}

// Função auxiliar para calcular média de visitas por detento
async function calcularVisitasPorDetento() {
  const visitasMap = new Map();

  // Buscar todas as visitas do último mês
  const ultimoMes = new Date();
  ultimoMes.setMonth(ultimoMes.getMonth() - 1);

  const visitasFamiliares = await VisitaFamiliarModel.find({
    data: { $gte: ultimoMes }
  });

  const visitasAdvogados = await VisitaAdvogadoModel.find({
    data: { $gte: ultimoMes }
  });

  // Contabilizar visitas por detento
  [...visitasFamiliares, ...visitasAdvogados].forEach(visita => {
    const detentoId = visita.detento.toString();
    visitasMap.set(detentoId, (visitasMap.get(detentoId) || 0) + 1);
  });

  return visitasMap;
}

module.exports = RelatorioController;