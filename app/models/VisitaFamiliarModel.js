const mongoose = require('mongoose');

const VisitaFamiliarSchema = new mongoose.Schema({
  detento: { type: mongoose.Schema.Types.ObjectId, ref: 'Detento', required: true }, // Detento associado à visita
  nomeFamiliar: { type: String, required: true }, // Nome do familiar
  relacao: { type: String, required: true }, // Relação com o detento (pai, mãe, irmão, etc.)
  dataVisita: { type: Date, required: true }, // Data da visita
  horaVisita: { type: String, required: true }, // Hora da visita (formato HH:MM)
  observacoes: { type: String } // Observações adicionais
});

module.exports = mongoose.model('VisitaFamiliar', VisitaFamiliarSchema);