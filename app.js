const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Swagger
const setupSwaggerDocs = require('./swagger');
setupSwaggerDocs(app);

// Rutas de la API
const authRoutes = require('./src/routes/authRoutes');
const carrerasRoutes = require('./src/routes/carrerasControllers');
const modalidadTitulacionRoutes = require('./src/routes/modalidadTitulacionRoutes');

app.use('/auth', authRoutes);
app.use('/carreras', carrerasRoutes);
app.use('/modalidad-titulacion', modalidadTitulacionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});
