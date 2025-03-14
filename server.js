const express = require('express');
const upload = require('./app/config/multerConfig'); 
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const authRoutes = require('./app/routes/authRoutes');
const authMiddleware = require('./app/middlewares/authMiddleware');
const flash = require('connect-flash');

dotenv.config();

const dbConfig = require('./app/config/db');
dbConfig.connect();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de Sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'sua-chave-secreta', // Use uma chave secreta forte
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Use `true` em produção com HTTPS
    maxAge: 1000 * 60 * 60 * 24 // Define o tempo de vida da sessão (24 horas)
  }
}));

app.use(flash());


app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  next();
});


app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  res.locals.user = req.session.user || null; 
  next();
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rotas
const detentoRoutes = require('./app/routes/detentoRoutes');
const celaRoutes = require('./app/routes/celaRoutes');
const relatorioRoutes = require('./app/routes/relatorioRoutes');
const visitaFamiliarRoutes = require('./app/routes/visitaFamiliarRoutes');
const visitaAdvogadoRoutes = require('./app/routes/visitaAdvogadoRoutes');
const alocacaoRoutes = require('./app/routes/alocacaoRoutes');
const pesquisaRoutes = require('./app/routes/pesquisaRoutes');



app.use('/detentos', authMiddleware, detentoRoutes);
app.use('/celas', authMiddleware, celaRoutes);
app.use('/relatorios', authMiddleware, relatorioRoutes);
app.use('/visitas', visitaFamiliarRoutes);
app.use('/visitasAdvogado', visitaAdvogadoRoutes);
app.use('/alocacao', alocacaoRoutes);
app.use('/', pesquisaRoutes )
app.use('/', authRoutes);

// Rota Padrão
app.get('/', (req, res) => {
  res.render('layouts/main', { title: 'Sistema de Gestão Penitenciária' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});