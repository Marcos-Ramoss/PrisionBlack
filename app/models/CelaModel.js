const mongoose = require('mongoose');

const CelaSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true },
  pavilhao: { type: String, enum: ['A', 'B', 'C'], required: true },
  capacidade: { type: Number, required: true },
  ocupantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Detento' }]
});

module.exports = mongoose.model('Cela', CelaSchema);