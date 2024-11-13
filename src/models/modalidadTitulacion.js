// models/modalidadTitulacion.js
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Facultad = require('./facultad');

const ModalidadTitulacion = sequelize.define('ModalidadTitulacion', {
    ModalidadID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    NombreModalidad: {
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
    FechaModificacion: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    FacultadID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false, // No usar timestamps de Sequelize (createdAt, updatedAt)
    tableName: 'ModalidadTitulacion',
});

// Relación con Facultad
ModalidadTitulacion.belongsTo(Facultad, {
    foreignKey: 'FacultadID',
    as: 'facultad',
});

module.exports = ModalidadTitulacion;
