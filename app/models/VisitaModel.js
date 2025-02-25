const mongoose = require('mongoose');

const VisitaFamiliarSchema = new mongoose.Schema({
  detento: { type: mongoose.Schema.Types.ObjectId, ref: 'Detento', required: true },
  visitante: { type: String, required: true },
  parentesco: { type: String, required: true },
  data: { type: Date, default: Date.now }
});

const VisitaAdvogadoSchema = new mongoose.Schema({
  detento: { type: mongoose.Schema.Types.ObjectId, ref: 'Detento', required: true },
  advogado: { type: String, required: true },
  data: { type: Date, default: Date.now }
});

module.exports = {
  VisitaFamiliar: mongoose.model('VisitaFamiliar', VisitaFamiliarSchema),
  VisitaAdvogado: mongoose.model('VisitaAdvogado', VisitaAdvogadoSchema)
};