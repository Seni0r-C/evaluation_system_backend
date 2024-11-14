// models/Carrera.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Facultad = require('./Facultad');

const Carrera = sequelize.define('Carrera', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    id_facultad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'carrera',
    timestamps: false,
});

Carrera.belongsTo(Facultad, { foreignKey: 'id_facultad' });

module.exports = Carrera;
