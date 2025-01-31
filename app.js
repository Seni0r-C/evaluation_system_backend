const express = require('express');
const cors = require('cors');
const morgan = require('morgan');  // Importar morgan
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Usar morgan para registrar las solicitudes HTTP
app.use(morgan('dev'));  // 'dev' es un formato de log predefinido

// Swagger
const setupSwaggerDocs = require('./src/config/swagger');
setupSwaggerDocs(app);

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

app.use('/auth', authRoutes);
app.use('/carrera', carrerasRoutes);
app.use('/modalidad-titulacion', modalidadTitulacionRoutes);
app.use('/trabajo-titulacion', trabajoTitulacionRoutes);
app.use('/calificacion', calificacionRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/rutas', rutasRoutes);
app.use('/roles', rolesRoutes);
app.use('/acta', actaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
    console.log(`http://localhost:${PORT}/api-docs`);
});
