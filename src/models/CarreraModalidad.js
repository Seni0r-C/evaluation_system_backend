// models/CarreraModalidad.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Carrera = require('./Carrera');
const ModalidadTitulacion = require('./ModalidadTitulacion');

const CarreraModalidad = sequelize.define('CarreraModalidad', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_carrera: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_modalidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'carrera_modalidad',
    timestamps: false,
});

CarreraModalidad.belongsTo(Carrera, { foreignKey: 'id_carrera' });
CarreraModalidad.belongsTo(ModalidadTitulacion, { foreignKey: 'id_modalidad' });

module.exports = CarreraModalidad;
