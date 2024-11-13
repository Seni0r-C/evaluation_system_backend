// models/facultad.js
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Facultad = sequelize.define('Facultad', {
    FacultadID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    NombreFacultad: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    Descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    FechaCreacion: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
}, {
    timestamps: false, // No usar timestamps de Sequelize (createdAt, updatedAt)
    tableName: 'Facultad',
});

module.exports = Facultad;
