const mongoose = require('mongoose');

const VisitaFamiliarSchema = new mongoose.Schema({
  detento: { type: mongoose.Schema.Types.ObjectId, ref: 'Detento', required: true }, 
  nomeFamiliar: { type: String, required: true }, 
  relacao: { type: String, required: true }, 
  dataVisita: { type: Date, required: true }, 
  horaVisita: { type: String, required: true }, 
  observacoes: { type: String } 
});

module.exports = mongoose.model('VisitaFamiliar', VisitaFamiliarSchema);