const CelaModel = require('../models/CelaModel');
const DetentoModel = require('../models/DetentoModel');
const VisitaFamiliarModel = require('../models/VisitaFamiliarModel');
const VisitaAdvogadoModel = require('../models/VisitaAdvogadoModel');

class RelatorioService {
  static async gerarOcupacao() {
    try {
      const celas = await CelaModel.find().populate({
        path: 'ocupantes',
        select: 'nome idade estadoCivil'
      });
      return celas;
    } catch (error) {
      throw new Error('Falha ao gerar relatório de ocupação: ' + error.message);
    }
  }

  static async gerarSaidas() {
    try {
      return await DetentoModel.find({ saida: { $exists: true, $ne: null } })
        .sort({ saida: -1 })
        .populate('cela');
    } catch (error) {
      throw new Error('Falha ao gerar relatório de saídas: ' + error.message);
    }
  }

  static async gerarEstatisticasGerais() {
    try {
      const totalDetentos = await DetentoModel.countDocuments();

      const celas = await CelaModel.find();
      const capacidadeTotal = celas.reduce((total, cela) => total + cela.capacidade, 0);

      const detentosAlocados = await DetentoModel.countDocuments({ cela: { $exists: true, $ne: null } });

      const taxaOcupacao = capacidadeTotal > 0 ? Math.round((detentosAlocados / capacidadeTotal) * 100) : 0;

      const detentosComIdade = await DetentoModel.find({ idade: { $exists: true } });
      const faixasEtarias = {
        '18-25': 0,
        '26-35': 0,
        '36-45': 0,
        '46-60': 0,
        '60+': 0
      };

      detentosComIdade.forEach(detento => {
        if (detento.idade <= 25) faixasEtarias['18-25']++;
        else if (detento.idade <= 35) faixasEtarias['26-35']++;
        else if (detento.idade <= 45) faixasEtarias['36-45']++;
        else if (detento.idade <= 60) faixasEtarias['46-60']++;
        else faixasEtarias['60+']++;
      });

      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - 30);

      const visitasFamiliares = await VisitaFamiliarModel.countDocuments({ data: { $gte: dataLimite } });
      const visitasAdvogados = await VisitaAdvogadoModel.countDocuments({ data: { $gte: dataLimite } });

      return {
        totalDetentos,
        capacidadeTotal,
        detentosAlocados,
        taxaOcupacao,
        faixasEtarias,
        visitasUltimos30Dias: {
          familiares: visitasFamiliares,
          advogados: visitasAdvogados,
          total: visitasFamiliares + visitasAdvogados
        }
      };
    } catch (error) {
      throw new Error('Falha ao gerar estatísticas gerais: ' + error.message);
    }
  }

  static async gerarDistribuicaoPorPavilhao() {
    try {
      const celas = await CelaModel.find().populate('ocupantes');
      const distribuicao = {};

      celas.forEach(cela => {
        if (!distribuicao[cela.pavilhao]) {
          distribuicao[cela.pavilhao] = {
            totalOcupantes: 0,
            capacidadeTotal: 0,
            taxaOcupacao: 0
          };
        }

        distribuicao[cela.pavilhao].totalOcupantes += cela.ocupantes.length;
        distribuicao[cela.pavilhao].capacidadeTotal += cela.capacidade;
      });

      // Calcular taxa de ocupação para cada pavilhão
      Object.keys(distribuicao).forEach(pavilhao => {
        const dados = distribuicao[pavilhao];
        dados.taxaOcupacao = dados.capacidadeTotal > 0
          ? Math.round((dados.totalOcupantes / dados.capacidadeTotal) * 100)
          : 0;
      });

      return distribuicao;
    } catch (error) {
      throw new Error('Falha ao gerar distribuição por pavilhão: ' + error.message);
    }
  }

  static async gerarDadosCrimes() {
    try {
      const detentos = await DetentoModel.find({ crimes: { $exists: true, $ne: [] } });
      const crimeCount = {};

      detentos.forEach(detento => {
        if (Array.isArray(detento.crimes)) {
          detento.crimes.forEach(crime => {
            crimeCount[crime] = (crimeCount[crime] || 0) + 1;
          });
        }
      });

      return Object.entries(crimeCount)
        .sort((a, b) => b[1] - a[1])
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});
    } catch (error) {
      throw new Error('Falha ao gerar dados de crimes: ' + error.message);
    }
  }
}

module.exports = RelatorioService;