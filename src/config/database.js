const { Sequelize } = require('sequelize');
require('dotenv').config(); // Asegúrate de cargar las variables del archivo .env

// Crea una nueva instancia de Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql', // Cambia a 'mariadb' si usas MariaDB
    logging: false,
});

module.exports = sequelize;
