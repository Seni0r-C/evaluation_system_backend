const express = require('express');
const cors = require('cors');
const morgan = require('morgan');  // Importar morgan
const { PORT, FRONT_URL } = require('./src/config/env.js');

const app = express();

const logger = (req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    if (req.headers) {
        console.log('Headers:', req.headers);
    }
    if (req.body) {
        console.log('Body:', req.body);
    }
    if (req.query) {
        console.log('Query:', req.query);
    }
    if (req.params) {
        console.log('Params:', req.params);
    }
    next();
}

// Swagger
// const setupSwaggerDocs = require('./src/config/swagger.js');
// setupSwaggerDocs(app);

const corsOptions = {
    // origin: FRONT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    // allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
// app.use(cors());
app.use(express.json());
app.use(logger);
app.use((req, res, next) => {
    const originalJson = res.json;

    res.json = function (body) {
        // Aquí puedes loguear, modificar o interceptar el JSON
        console.log('DEBUG response JSON:', body);

        // También puedes modificarlo si quieres
        // body.debug = true;

        return originalJson.call(this, body); // Llamas al original para continuar
    };

    next(); // Continúa con la siguiente función o ruta
});


// Usar morgan para registrar las solicitudes HTTP
app.use(morgan('dev'));  // 'dev' es un formato de log predefinido


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
app.use('/permisos', require('./src/routes/permisosRoutes.js'));
app.use('/roles-permisos', require('./src/routes/rolesPermisosRoutes.js'));
app.use('/indexacion-revista', indexacionRevistaRoute);
app.use('/indexacion-revista-trabajo', indexacionRevistaTrabajoRoute);

app.use('/acta', actaRoutes);
app.use('/notas', notasRoutes);
app.use('/rubrica', rubricaRoutes);
app.use('/reportes', reportesRoutes);
app.get('/', (req, res) => res.json({ gretting: "Hello world!" }));
app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
    console.log("Link: http://localhost:" + PORT);
    console.log(`/api-docs`);
});
