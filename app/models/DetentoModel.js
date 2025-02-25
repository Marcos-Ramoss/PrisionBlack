const mongoose = require('mongoose');

const DetentoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  idade: { type: Number, required: true },
  filiacao: { type: String, required: true },
  estadoCivil: { type: String, required: true },
  foto: { type: String }, // Caminho para a imagem
  reincidencia: { type: Boolean, default: false },
  crimes: [{ type: String }],
  cela: { type: mongoose.Schema.Types.ObjectId, ref: 'Cela' },
  historicoTransferencias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transferencia' }],
  historicoIsolamento: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Isolamento' }],
  visitasFamiliares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VisitaFamiliar' }],
  visitasAdvogados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VisitaAdvogado' }],
  saida: { type: Date }
});

module.exports = mongoose.model('Detento', DetentoSchema);