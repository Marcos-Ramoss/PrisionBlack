const LogModel = require('../models/LogModel');

class LogService {
  static async registrarLog(usuario, acao, detalhes = '') {
    const log = new LogModel({ usuario, acao, detalhes });
    await log.save();
  }
}

module.exports = LogService;