const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Rutas de la API
const authRoutes = require('./src/routes/authRoutes');
const carrerasRoutes = require('./src/routes/carrerasControllers');
app.use('/auth', authRoutes);
app.use('/carreras', carrerasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});
