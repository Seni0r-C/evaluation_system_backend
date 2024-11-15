// models/ModalidadTitulacion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ModalidadTitulacion = sequelize.define('ModalidadTitulacion', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: 'modalidad_titulacion',
    timestamps: false,
});

module.exports = ModalidadTitulacion;
