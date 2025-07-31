const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { PORT, FRONTEND_URL } = require('./src/config/env.js');
const pool = require('./src/config/db.js');
const app = express();
const constantes = require('./src/utils/constantes.js');
const logger = require('./src/config/logger.js');

const LogColors = constantes.LogColors;
const corsOptions = {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(logger);
app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function (body) {
        const timestamp = constantes.getCurrentTime();
        console.log(`${LogColors.Dim}[${timestamp}]${LogColors.Reset} ${LogColors.Fg.Magenta}↳ Response:${LogColors.Reset}`);
        console.log(JSON.stringify(body, null, 2));
        return originalJson.call(this, body);
    };
    next();
});

// Usar morgan para registrar las solicitudes HTTP
app.use(morgan('dev'));

// Rutas de la API
const authRoutes = require('./src/routes/authRoutes');
const carrerasRoutes = require('./src/routes/carrerasRoutes');
const modalidadTitulacionRoutes = require('./src/routes/modalidadTitulacionRoutes');
const trabajoTitulacionRoutes = require('./src/routes/trabajoTitulacionRoutes');
const calificacionRoutes = require('./src/routes/calificacionRoutes');
const usuariosRoutes = require('./src/routes/usuariosRoutes');
const rutasRoutes = require('./src/routes/rutasRoutes');
const rolesRoutes = require('./src/routes/rolesRoutes');
const actaRoutes = require('./src/routes/actaRoutes');
const notasRoutes = require('./src/routes/notasRoutes');
const rubricaRoutes = require('./src/routes/rubricaRoutes');
const reportesRoutes = require('./src/routes/reportesRoutes');
const indexacionRevistaTrabajoRoute = require('./src/routes/indexacionRevistaTrabajoTitulacionRoute');
const indexacionRevistaRoute = require('./src/routes/indexacionRevistaRoute');

app.use('/auth', authRoutes);
app.use('/carrera', carrerasRoutes);
app.use('/modalidad-titulacion', modalidadTitulacionRoutes);
app.use('/trabajo-titulacion', trabajoTitulacionRoutes);
app.use('/calificacion', calificacionRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/rutas', rutasRoutes);

app.use('/roles', rolesRoutes);
app.use('/indexacion-revista', indexacionRevistaRoute);
app.use('/indexacion-revista-trabajo', indexacionRevistaTrabajoRoute);

app.use('/acta', actaRoutes);
app.use('/notas', notasRoutes);
app.use('/rubrica', rubricaRoutes);
app.use('/reportes', reportesRoutes);
app.get('/', (req, res) => {
    res.type('text/plain');
    res.send(`
    ///////////////////////////////////
   //          API ONLINE           //
  ///////////////////////////////////
  
  STATUS  : ACTIVE
  UPTIME  : ${(process.uptime() / 60).toFixed(2)} minutes
  TIME    : ${new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, '')}
  `);
});

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`\n${LogColors.Bg.Green}${LogColors.Fg.Black} SERVIDOR INICIADO ${LogColors.Reset}`);
        console.log(`${LogColors.Fg.Green}• Puerto:${LogColors.Reset}       ${PORT}`);
        console.log(`${LogColors.Fg.Green}• URL Local:${LogColors.Reset}   ${LogColors.Underscore}http://localhost:${PORT}${LogColors.Reset}`);
        console.log(`${LogColors.Dim}──────────────────────────────────────────${LogColors.Reset}\n`);
    });
};

const init = async () => {
    try {
        const connection = await pool.getConnection();
        console.log(`${LogColors.Fg.Green}✓ Conexión a la base de datos establecida${LogColors.Reset}`);
        connection.release();
        startServer();
    } catch (error) {
        console.error(`\n${LogColors.Bg.Red}${LogColors.Fg.White} ERROR DE CONEXIÓN ${LogColors.Reset}`);
        console.error(`${LogColors.Fg.Red}• Motivo:${LogColors.Reset} ${error.message ? error.message : "No se pudo establecer la conexión con la base de datos."}`);
        console.error(`${LogColors.Fg.Red}• Detalles:${LogColors.Reset}\n`, error.stack);
        console.log(`${LogColors.Dim}──────────────────────────────────────────${LogColors.Reset}\n`);
        process.exit(1);
    }
};

init();