const mongoose = require('mongoose');
require('dotenv').config();

const connect = async () => {
  try {
    console.log('Iniciando conexão com o MongoDB...');
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/prison-management';

    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Adiciona listeners para eventos de conexão
    mongoose.connection.on('connected', () => {
      console.log('Mongoose conectado ao MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Erro na conexão do Mongoose:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose desconectado do MongoDB');
    });

    console.log('Conexão com o MongoDB estabelecida com sucesso');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = { connect };