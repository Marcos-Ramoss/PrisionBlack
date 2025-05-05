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
      let detentos;
      try {
        // Simplesmente buscar os detentos sem tentar popular o usuarioAlocador,
        // já que este campo contém valores de string diretamente em vez de IDs
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
        // Respeitar a prioridade dos campos
        if (!detento.registradoPor || detento.registradoPor === 'Usuário não disponível') {
          if (detento.usuarioCadastro) {
            detento.registradoPor = detento.usuarioCadastro;
          } else if (detento.historicoAlocacao && detento.historicoAlocacao.length > 0) {
            detento.registradoPor = detento.historicoAlocacao[0].usuarioAlocador;
          } else {
            // Verificar se o usuário logado é um inspetor e se os detentos sem registro são recentes (últimas 24h)
            if (req.session && req.session.user && req.session.user.nivelAcesso === 'INSPETOR') {
              // Para inspetores, assumir que detentos recentes sem registro foram cadastrados por eles
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
        
        // Garantir que o array de crimes exista
        if (!detento.crimes) {
          detento.crimes = [];
        }
        
        return detento;
      });

      // Calcular média de tempo de detenção (em meses)
      const mediaTempoDetencao = await calcularMediaTempoDetencao(detentosProcessados);

      // Buscar pavilhões únicos
      const pavilhoes = [...new Set(celas.map(cela => cela.pavilhao))];

      // Calcular média de visitas por mês
      const visitasPorDetento = await calcularVisitasPorDetento();

      // Buscar outras estatísticas relevantes
      const estatisticasAdicionais = await gerarEstatisticasAdicionais(detentosProcessados);

      // Renderizar a view com todas as estatísticas
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
        ...estatisticasAdicionais
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      res.status(500).send('Erro ao gerar relatório: ' + error.message);
    }
  }

  static async saidas(req, res) {
    try {
      // Buscar detentos com saída e processar dados adicionais
      const detentosSaidosBasicos = await RelatorioService.gerarSaidas();
      
      // Processar dados para incluir mais informações
      const detentosSaidos = detentosSaidosBasicos.map(detento => {
        const detentoObj = detento.toObject();
        
        // Garantir que campos existam para evitar erros
        if (!detentoObj.crimes) detentoObj.crimes = [];
        if (!detentoObj.dataEntrada) detentoObj.dataEntrada = null;
        
        // Se não tiver a informação de quem registrou, definir como não disponível
        if (!detentoObj.registradoPor) {
          // Tentar extrair o nome do usuário do histórico de alocação, se disponível
          if (detentoObj.historicoAlocacao && detentoObj.historicoAlocacao.length > 0) {
            // Usar o usuário da primeira alocação como registrador
            detentoObj.registradoPor = 
              detentoObj.historicoAlocacao[0].usuarioAlocador || 'Não disponível';
          } else {
            detentoObj.registradoPor = 'Não disponível';
          }
        }
        
        return detentoObj;
      });
      
      // Calcular estatísticas
      const estatisticas = {
        totalSaidas: detentosSaidos.length,
        saidasMes: calcularSaidasNoMesAtual(detentosSaidos),
        mediaPermanencia: calcularMediaPermanencia(detentosSaidos)
      };
      
      res.render('relatorios/saidas', { 
        detentosSaidos, 
        estatisticas,
        user: req.session.user 
      });
    } catch (error) {
      console.error('Erro ao gerar relatório de saídas:', error);
      res.status(500).send(error.message);
    }
  }
}

// Função auxiliar para calcular média de tempo de detenção
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

// Função para calcular estatísticas adicionais
async function gerarEstatisticasAdicionais(detentos) {
  // Distribuição por faixa etária
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
  
  // Distribuição por crimes mais comuns
  const crimesCount = {};
  detentos.forEach(detento => {
    if (!detento.crimes || !Array.isArray(detento.crimes)) return;
    
    detento.crimes.forEach(crime => {
      crimesCount[crime] = (crimesCount[crime] || 0) + 1;
    });
  });
  
  // Ordenar crimes por frequência
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

// Funções para estatísticas de saídas
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