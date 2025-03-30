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
const methodOverride = require('method-override');


// Rotas
const detentoRoutes = require('./app/routes/detentoRoutes');
const celaRoutes = require('./app/routes/celaRoutes');
const relatorioRoutes = require('./app/routes/relatorioRoutes');
const visitaFamiliarRoutes = require('./app/routes/visitaFamiliarRoutes');
const visitaAdvogadoRoutes = require('./app/routes/visitaAdvogadoRoutes');
const alocacaoRoutes = require('./app/routes/alocacao');
const pesquisaRoutes = require('./app/routes/pesquisaRoutes');
const adminRoutes = require('./app/routes/adminRoutes');
const userRoutes = require('./app/routes/userRoutes');


dotenv.config();

const dbConfig = require('./app/config/db');
dbConfig.connect();

const app = express();

// Configuração do middleware method-override
app.use(methodOverride('_method'));

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
    secret: process.env.SESSION_SECRET || 'q3LLITDQyH',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
  })
);
app.use(cookieParser());
app.use(flash());




app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.error_msg = req.flash('error');
  res.locals.success_msg = req.flash('success');
  next();
});


app.use(express.static(path.join(__dirname, 'public')));

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
app.use('/usuarios', authenticate, userRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});