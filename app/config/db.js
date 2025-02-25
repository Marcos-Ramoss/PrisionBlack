const mongoose = require('mongoose');
require('dotenv').config();

const connect = async () => {
  try {
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/prison-management';
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    process.exit(1); // Encerra o processo em caso de erro
  }
};

module.exports = { connect };