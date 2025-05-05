const mongoose = require('mongoose');

const VisitaAdvogadoSchema = new mongoose.Schema({
  detento: { type: mongoose.Schema.Types.ObjectId, ref: 'Detento', required: true }, // Detento associado à visita
  nomeAdvogado: { type: String, required: true }, // Nome do advogado
  numeroOAB: { type: String, required: true }, // Número da OAB
  dataVisita: { type: Date, required: true }, // Data da visita
  horaVisita: { type: String, required: true }, // Hora da visita (formato HH:MM)
  observacoes: { type: String } // Observações adicionais
});

module.exports = mongoose.model('VisitaAdvogado', VisitaAdvogadoSchema);