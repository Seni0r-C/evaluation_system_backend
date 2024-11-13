const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Rutas de la API
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});
