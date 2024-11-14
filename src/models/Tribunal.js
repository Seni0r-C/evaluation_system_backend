// models/Tribunal.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const TrabajoTitulacion = require('./TrabajoTitulacion');

const Tribunal = sequelize.define('Tribunal', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_trabajo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_profesor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'tribunal',
    timestamps: false,
});

Tribunal.belongsTo(Usuario, { foreignKey: 'id_profesor' });
Tribunal.belongsTo(TrabajoTitulacion, { foreignKey: 'id_trabajo' });

module.exports = Tribunal;
