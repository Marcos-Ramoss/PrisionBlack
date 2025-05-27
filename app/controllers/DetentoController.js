const DetentoService = require('../services/DetentoService');
const CelaService = require('../services/CelaService');
const multerConfig = require('../config/multerConfig');
const { authenticate, authorize } = require('../middlewares/authMiddleware');


class DetentoController {
  static async cadastrar(req, res) {
    try {
      if (req.method === 'GET') {
        const celas = await CelaService.listar();
        res.render('detentos/cadastro', {
          celas,
          user: req.session.user,
          error: null,
          currentPage: 'detentos'
        });
      } else if (req.method === 'POST') {
        const { nome, idade, filiacao, estadoCivil, reincidencia, crimes, cela } = req.body;
        const foto = req.file ? req.file.filename : null;

        const usuarioAtual = req.session.user ? req.session.user.nome : 'Sistema';

        const novoDetento = await DetentoService.cadastrar({
          nome,
          idade,
          filiacao,
          estadoCivil,
          foto,
          reincidencia: reincidencia === 'true',
          crimes: crimes.split(',').map((crime) => crime.trim()),
          cela: cela || null,
          // Adicionar informações sobre quem registrou
          registradoPor: usuarioAtual,
          usuarioCadastro: usuarioAtual,
          // Se tem cela, adicionar ao histórico de alocação
          comAlocacaoInicial: !!cela
        });

        res.redirect('/detentos/lista');
      }
    } catch (error) {
      const celas = await CelaService.listar();
      res.render('detentos/cadastro', {
        celas,
        user: req.session.user,
        error: error.message,
        currentPage: 'detentos'
      });
    }
  }

  static async listar(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const search = req.query.search || '';
      const pavilhao = req.query.pavilhao || '';
      const reincidencia = req.query.reincidencia || '';
      const { detentos, total, totalPages } = await DetentoService.listarPaginado(page, limit, search, pavilhao, reincidencia);
      res.render('detentos/lista', {
        detentos,
        user: req.session.user,
        page,
        totalPages,
        total,
        limit,
        search,
        pavilhao,
        reincidencia,
        currentPage: 'detentos'
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async detalhes(req, res) {
    try {
      const { id } = req.params;
      const detento = await DetentoService.buscarPorId(id);
      if (!detento) return res.status(404).send('Detento não encontrado.');
      res.render('detentos/detalhes', {
        detento,
        user: req.session.user,
        currentPage: 'detentos'
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async editar(req, res) {
    try {
      const { id } = req.params;
      const detento = await DetentoService.buscarPorId(id);
      if (!detento) return res.status(404).send('Detento não encontrado.');

      res.render('detentos/editar', {
        detento,
        user: req.session.user,
        currentPage: 'detentos'
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, idade, filiacao, estadoCivil, reincidencia, crimes } = req.body;

      const foto = req.file ? req.file.filename : undefined;

      const dadosAtualizados = {
        nome,
        idade,
        filiacao,
        estadoCivil,
        foto: foto || undefined,
        reincidencia: reincidencia === 'true',
        crimes: crimes.split(',').map((crime) => crime.trim())
      };

      const detentoAtualizado = await DetentoService.atualizar(id, dadosAtualizados);
      if (!detentoAtualizado) return res.status(404).send('Detento não encontrado.');

      res.redirect('/detentos/lista');
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async excluir(req, res) {
    try {
      const { id } = req.params;

      await DetentoService.excluir(id);
      res.redirect('/detentos/lista');
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async pesquisar(req, res) {
    try {
      const { nome } = req.query;
      const detentos = await DetentoService.pesquisarPorNome(nome);

      res.json(detentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports = DetentoController;