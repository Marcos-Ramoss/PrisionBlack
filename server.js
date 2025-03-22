const express = require('express');
const upload = require('./app/config/multerConfig');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const authRoutes = require('./app/routes/authRoutes');
const { authenticate, authorize } = require('./app/middlewares/authMiddleware');
const flash = require('connect-flash');
const cors = require('cors');
const cookieParser = require('cookie-parser');


// Rotas
const detentoRoutes = require('./app/routes/detentoRoutes');
const celaRoutes = require('./app/routes/celaRoutes');
const relatorioRoutes = require('./app/routes/relatorioRoutes');
const visitaFamiliarRoutes = require('./app/routes/visitaFamiliarRoutes');
const visitaAdvogadoRoutes = require('./app/routes/visitaAdvogadoRoutes');
const alocacaoRoutes = require('./app/routes/alocacaoRoutes');
const pesquisaRoutes = require('./app/routes/pesquisaRoutes');
const adminRoutes = require('./app/routes/adminRoutes');


dotenv.config();

const dbConfig = require('./app/config/db');
dbConfig.connect();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: 'http://localhost:3000', // Substitua pelo domínio do frontend
    credentials: true, // Permite o envio de cookies
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'q3LLITDQyH', // Use uma chave secreta forte
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      secure: false, // Use `true` em produção (HTTPS)
      httpOnly: true, // Protege o cookie contra acesso via JavaScript
      maxAge: 1000 * 60 * 60 * 24, // Define o tempo de vida da sessão (24 horas)
    },
  })
);
app.use(cookieParser());
app.use(flash());




app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  next();
});


app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));




app.use('/', pesquisaRoutes)
app.use('/', authRoutes);

app.use('/detentos', authenticate, detentoRoutes);
app.use('/celas', authenticate, celaRoutes);
app.use('/relatorios', authenticate, relatorioRoutes);
app.use('/visitas', authenticate, visitaFamiliarRoutes);
app.use('/visitasAdvogado', authenticate, visitaAdvogadoRoutes);
app.use('/alocacao', authenticate, alocacaoRoutes);
app.use('/admin', authenticate, adminRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});