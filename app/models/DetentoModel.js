const mongoose = require('mongoose');

const DetentoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  idade: { type: Number, required: true },
  filiacao: { type: String, required: true },
  estadoCivil: { type: String, required: true },
  foto: { type: String }, 
  reincidencia: { type: Boolean, default: false },
  crimes: [{ type: String }],
  cela: { type: mongoose.Schema.Types.ObjectId, ref: 'Cela' },
  historicoTransferencias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transferencia' }],
  historicoIsolamento: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Isolamento' }],
  visitasFamiliares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VisitaFamiliar' }],
  visitasAdvogados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VisitaAdvogado' }],
  saida: { type: Date },
  registradoPor: { type: String, default: 'Sistema' },
  usuarioCadastro: { type: String, default: 'Sistema' }, 
  dataRegistro: { type: Date, default: Date.now },
  historicoAlocacao: [{
    data: { type: Date, default: Date.now },
    celaCodigo: { type: String },
    usuarioAlocador: {
      type: mongoose.Schema.Types.String,
      ref: 'Usuario',
      required: false
    }
  }]
});

module.exports = mongoose.model('Detento', DetentoSchema);