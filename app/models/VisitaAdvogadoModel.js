const mongoose = require('mongoose');

const VisitaAdvogadoSchema = new mongoose.Schema({
  detento: { type: mongoose.Schema.Types.ObjectId, ref: 'Detento', required: true }, 
  nomeAdvogado: { type: String, required: true }, 
  numeroOAB: { type: String, required: true }, 
  dataVisita: { type: Date, required: true }, 
  horaVisita: { type: String, required: true }, 
  observacoes: { type: String } 
});

module.exports = mongoose.model('VisitaAdvogado', VisitaAdvogadoSchema);