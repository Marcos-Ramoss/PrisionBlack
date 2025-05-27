const RelatorioService = require('../services/RelatorioService');
const DetentoModel = require('../models/DetentoModel');
const CelaModel = require('../models/CelaModel');
const VisitaFamiliarModel = require('../models/VisitaFamiliarModel');
const VisitaAdvogadoModel = require('../models/VisitaAdvogadoModel');

class RelatorioController {
  static async ocupacao(req, res) {
    try {

      const celas = await CelaModel.find().populate('ocupantes');
      const totalDetentos = await DetentoModel.countDocuments();
      const totalCelas = await CelaModel.countDocuments();
      const celasOcupadas = await CelaModel.countDocuments({ 'ocupantes.0': { $exists: true } });

      const taxaOcupacao = Math.round((celasOcupadas / totalCelas) * 100);

      const detentosReincidentes = await DetentoModel.countDocuments({ reincidente: true });
      const percentualReincidencia = Math.round((detentosReincidentes / totalDetentos) * 100);

      let detentos;
      try {
        detentos = await DetentoModel.find()
          .populate('cela')
          .lean();
      } catch (error) {
        console.error('Erro ao buscar detentos:', error);
        throw error;
      }

      // Processar dados dos detentos para o relatório
      const detentosProcessados = detentos.map(detento => {
        // Processar histórico de alocação
        if (detento.historicoAlocacao && detento.historicoAlocacao.length > 0) {
          detento.historicoAlocacao = detento.historicoAlocacao.map(alocacao => {
            return {
              ...alocacao,
              usuarioAlocador: alocacao.usuarioAlocador || 'Usuário não disponível'
            };
          });
        }

        // Garantir que temos informação sobre quem cadastrou o detento
        if (!detento.registradoPor || detento.registradoPor === 'Usuário não disponível') {
          if (detento.usuarioCadastro) {
            detento.registradoPor = detento.usuarioCadastro;
          } else if (detento.historicoAlocacao && detento.historicoAlocacao.length > 0) {
            detento.registradoPor = detento.historicoAlocacao[0].usuarioAlocador;
          } else {
            if (req.session && req.session.user && req.session.user.nivelAcesso === 'INSPETOR') {
              if (detento._id && detento._id.getTimestamp) {
                const dataCriacao = detento._id.getTimestamp();
                const agora = new Date();
                const diferencaHoras = (agora - dataCriacao) / (1000 * 60 * 60);

                if (diferencaHoras < 24) {
                  detento.registradoPor = req.session.user.nome;
                } else {
                  detento.registradoPor = 'Usuário não disponível';
                }
              } else {
                detento.registradoPor = 'Usuário não disponível';
              }
            } else {
              detento.registradoPor = 'Usuário não disponível';
            }
          }
        }

        if (!detento.crimes) {
          detento.crimes = [];
        }

        return detento;
      });

      const mediaTempoDetencao = await calcularMediaTempoDetencao(detentosProcessados);

      const pavilhoes = [...new Set(celas.map(cela => cela.pavilhao))];

      const visitasPorDetento = await calcularVisitasPorDetento();

      const estatisticasAdicionais = await gerarEstatisticasAdicionais(detentosProcessados);

      res.render('relatorios/ocupacao', {
        user: req.session.user,
        celas,
        detentos: detentosProcessados,
        totalDetentos,
        taxaOcupacao,
        percentualReincidencia,
        mediaTempoDetencao,
        pavilhoes,
        visitasPorDetento,
        ...estatisticasAdicionais,
        currentPage: 'relatorios'
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      res.status(500).send('Erro ao gerar relatório: ' + error.message);
    }
  }

  static async saidas(req, res) {
    try {
      const detentosSaidosBasicos = await RelatorioService.gerarSaidas();

      const detentosSaidos = detentosSaidosBasicos.map(detento => {
        const detentoObj = detento.toObject();

        if (!detentoObj.crimes) detentoObj.crimes = [];
        if (!detentoObj.dataEntrada) detentoObj.dataEntrada = null;
        if (!detentoObj.registradoPor) {
          if (detentoObj.historicoAlocacao && detentoObj.historicoAlocacao.length > 0) {
            detentoObj.registradoPor =
              detentoObj.historicoAlocacao[0].usuarioAlocador || 'Não disponível';
          } else {
            detentoObj.registradoPor = 'Não disponível';
          }
        }

        return detentoObj;
      });

      const estatisticas = {
        totalSaidas: detentosSaidos.length,
        saidasMes: calcularSaidasNoMesAtual(detentosSaidos),
        mediaPermanencia: calcularMediaPermanencia(detentosSaidos)
      };

      res.render('relatorios/saidas', {
        detentosSaidos,
        estatisticas,
        user: req.session.user,
        currentPage: 'relatorios'
      });
    } catch (error) {
      console.error('Erro ao gerar relatório de saídas:', error);
      res.status(500).send(error.message);
    }
  }
}

async function calcularMediaTempoDetencao(detentos) {
  if (!detentos.length) return 0;

  const tempoTotal = detentos.reduce((acc, detento) => {
    if (!detento.dataEntrada) return acc;

    const entrada = new Date(detento.dataEntrada);
    const hoje = new Date();
    const diffMeses = (hoje - entrada) / (1000 * 60 * 60 * 24 * 30); // Aproximação em meses
    return acc + diffMeses;
  }, 0);

  return Math.round(tempoTotal / detentos.length);
}

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

async function gerarEstatisticasAdicionais(detentos) {
  const faixasEtarias = {
    '18-25': 0,
    '26-35': 0,
    '36-45': 0,
    '46-60': 0,
    '60+': 0
  };

  detentos.forEach(detento => {
    if (!detento.idade) return;

    if (detento.idade <= 25) faixasEtarias['18-25']++;
    else if (detento.idade <= 35) faixasEtarias['26-35']++;
    else if (detento.idade <= 45) faixasEtarias['36-45']++;
    else if (detento.idade <= 60) faixasEtarias['46-60']++;
    else faixasEtarias['60+']++;
  });

  const crimesCount = {};
  detentos.forEach(detento => {
    if (!detento.crimes || !Array.isArray(detento.crimes)) return;

    detento.crimes.forEach(crime => {
      crimesCount[crime] = (crimesCount[crime] || 0) + 1;
    });
  });

  const crimesSorted = Object.entries(crimesCount)
    .sort((a, b) => b[1] - a[1])
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  return {
    faixasEtarias,
    crimesCount: crimesSorted
  };
}

function calcularSaidasNoMesAtual(detentos) {
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  return detentos.filter(detento => {
    if (!detento.saida) return false;

    const dataSaida = new Date(detento.saida);
    return dataSaida.getMonth() === mesAtual && dataSaida.getFullYear() === anoAtual;
  }).length;
}

function calcularMediaPermanencia(detentos) {
  let totalDias = 0;
  let contagemValida = 0;

  detentos.forEach(detento => {
    if (detento.dataEntrada && detento.saida) {
      const entrada = new Date(detento.dataEntrada);
      const saida = new Date(detento.saida);
      const dias = Math.floor((saida - entrada) / (1000 * 60 * 60 * 24));

      totalDias += dias;
      contagemValida++;
    }
  });

  return contagemValida > 0 ? Math.round(totalDias / contagemValida) : 0;
}

module.exports = RelatorioController;