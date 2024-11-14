// models/TrabajoTitulacion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const CarreraModalidad = require('./CarreraModalidad');

const TrabajoTitulacion = sequelize.define('TrabajoTitulacion', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    titulo: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    fecha_registro: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    id_tutor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    archivo_link: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'defensa', 'calificada'),
        allowNull: true,
    },
    id_carrera_modalidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'trabajotitulacion',
    timestamps: false,
});

TrabajoTitulacion.belongsTo(Usuario, { foreignKey: 'id_tutor' });
TrabajoTitulacion.belongsTo(CarreraModalidad, { foreignKey: 'id_carrera_modalidad' });

module.exports = TrabajoTitulacion;
