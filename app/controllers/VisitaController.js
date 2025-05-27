const VisitaFamiliarService = require('../services/VisitaFamiliarService');
const VisitaAdvogadoService = require('../services/VisitaAdvogadoService');
const DetentoService = require('../services/DetentoService');
const moment = require('moment-timezone');

class VisitaController {
  static async listar(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const search = req.query.search || '';
      const tipo = req.query.tipo || '';
      const data = req.query.data || '';
      // Buscar todas as visitas filtradas (sem skip/limit)
      const [familiar, advogado] = await Promise.all([
        VisitaFamiliarService.listarPaginado(1, Number.MAX_SAFE_INTEGER, search),
        VisitaAdvogadoService.listarPaginado(1, Number.MAX_SAFE_INTEGER, search)
      ]);
      // Unir e marcar tipo
      let visitas = [
        ...familiar.visitas.map(v => ({ ...v.toObject(), tipo: 'familiar' })),
        ...advogado.visitas.map(v => ({ ...v.toObject(), tipo: 'advogado' }))
      ];
      // Filtrar por tipo se necessário
      if (tipo === 'familiar' || tipo === 'advogado') {
        visitas = visitas.filter(v => v.tipo === tipo);
      }
      // Filtrar por data se necessário
      if (data) {
        visitas = visitas.filter(v => {
          const dataVisitaStr = new Date(v.dataVisita).toISOString().slice(0, 10);
          return dataVisitaStr === data;
        });
      }
      // Ordenar por data
      visitas.sort((a, b) => new Date(b.dataVisita) - new Date(a.dataVisita));
      // Paginar no array unido
      const total = visitas.length;
      const totalPages = Math.ceil(total / limit);
      const paginatedVisitas = visitas.slice((page - 1) * limit, page * limit);
      res.render('visitas/lista', {
        visitas: paginatedVisitas,
        user: req.session.user,
        page,
        totalPages,
        total,
        limit,
        search,
        tipo,
        data,
        currentPage: 'visitas'
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async cadastrar(req, res) {
    try {
      if (req.method === 'GET') {
        // Renderiza o formulário de cadastro com a lista de detentos
        const detentos = await DetentoService.listar();
        res.render('visitas/cadastro', { 
          detentos, 
          user: req.session.user,
          currentPage: 'visitas'
        });
      } else if (req.method === 'POST') {
        const { 
          detentoId, 
          tipoVisita, 
          nomeFamiliar, 
          relacao, 
          nomeAdvogado, 
          numeroOAB, 
          dataVisita,
          horaVisita,
          observacoes 
        } = req.body;
        
        // Usar o timezone correto para a data da visita
        const dataVisitaAmazonas = moment.tz(dataVisita, 'America/Manaus').toDate();
        
        if (tipoVisita === 'familiar') {
          // Cadastra visita familiar
          await VisitaFamiliarService.cadastrar({
            detento: detentoId,
            nomeFamiliar,
            relacao,
            dataVisita: dataVisitaAmazonas,
            horaVisita,
            observacoes
          });
        } else if (tipoVisita === 'advogado') {
          // Cadastra visita de advogado
          await VisitaAdvogadoService.cadastrar({
            detento: detentoId,
            nomeAdvogado,
            numeroOAB,
            dataVisita: dataVisitaAmazonas,
            horaVisita,
            observacoes
          });
        }
        
        res.redirect('/visitas/lista');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async editar(req, res) {
    try {
      const { id, tipo } = req.params;

      if (req.method === 'GET') {
        // Busca a visita apropriada com base no tipo
        let visita;
        if (tipo === 'familiar') {
          visita = await VisitaFamiliarService.buscarPorId(id);
        } else if (tipo === 'advogado') {
          visita = await VisitaAdvogadoService.buscarPorId(id);
        }
        
        if (!visita) return res.status(404).send('Visita não encontrada.');
        
        const detentos = await DetentoService.listar();
        res.render('visitas/editar', { 
          visita, 
          tipo, 
          detentos, 
          user: req.session.user,
          currentPage: 'visitas'
        });
      } else if (req.method === 'POST') {
        // Campos comuns
        const { detentoId, dataVisita, horaVisita, observacoes } = req.body;
        const dataVisitaAmazonas = moment.tz(dataVisita, 'America/Manaus').toDate();
        
        if (tipo === 'familiar') {
          // Atualiza visita familiar
          const { nomeFamiliar, relacao } = req.body;
          await VisitaFamiliarService.editar(id, {
            detento: detentoId,
            nomeFamiliar,
            relacao,
            dataVisita: dataVisitaAmazonas,
            horaVisita,
            observacoes
          });
        } else if (tipo === 'advogado') {
          // Atualiza visita de advogado
          const { nomeAdvogado, numeroOAB } = req.body;
          await VisitaAdvogadoService.editar(id, {
            detento: detentoId,
            nomeAdvogado,
            numeroOAB,
            dataVisita: dataVisitaAmazonas,
            horaVisita,
            observacoes
          });
        }
        
        res.redirect('/visitas/lista');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async excluir(req, res) {
    try {
      const { id, tipo } = req.params;
      
      if (tipo === 'familiar') {
        await VisitaFamiliarService.excluir(id);
      } else if (tipo === 'advogado') {
        await VisitaAdvogadoService.excluir(id);
      }
      
      res.redirect('/visitas/lista');
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = VisitaController; 