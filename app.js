const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const sequelize = require('./src/config/database');
require('dotenv').config();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Sincroniza los modelos con la base de datos
sequelize.sync({ force: false }) // Cambia a true para sobrescribir tablas existentes (cuidado)
    .then(() => {
        console.log("Base de datos y tablas creadas");
    })
    .catch((error) => {
        console.error("Error al sincronizar la base de datos:", error);
    });

// Rutas de la API
const authRoutes = require('./src/routes/authRoutes');
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});
