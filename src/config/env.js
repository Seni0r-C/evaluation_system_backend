// config/env.js

// Cargar dotenv para leer el archivo .env
const dotenv = require('dotenv');

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Exportar las variables de entorno como un objeto
module.exports = {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'sgp',
    DB_PORT: process.env.DB_PORT || 3306,
    PORT: process.env.PORT || 3000,          // Puerto para la API
    JWT_SECRET: process.env.JWT_SECRET || 'supersecret', // Llave secreta para JWT
    NODE_ENV: process.env.NODE_ENV || 'development' // Entorno (desarrollo o producción)
};
