const { VisitaFamiliar, VisitaAdvogado } = require('../models/VisitaModel');
const LogService = require('./LogService');

class VisitaService {
  static async registrarVisitaFamiliar(dados) {
    const visita = new VisitaFamiliar(dados);
    await visita.save();
    LogService.registrarLog('Visita familiar registrada', `Visita de ${dados.visitante} ao detento ${dados.detento}`);
  }

  static async registrarVisitaAdvogado(dados) {
    const visita = new VisitaAdvogado(dados);
    await visita.save();
    LogService.registrarLog('Visita de advogado registrada', `Visita de ${dados.advogado} ao detento ${dados.detento}`);
  }
}

module.exports = VisitaService;