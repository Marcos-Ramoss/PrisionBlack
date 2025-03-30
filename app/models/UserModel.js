const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  nivelAcesso: {
    type: String,
    enum: ['ADMIN', 'DIRETOR', 'INSPETOR'],
    required: true,
  },
  criadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Usuario', UsuarioSchema);