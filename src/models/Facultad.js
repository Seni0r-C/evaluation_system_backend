// models/Facultad.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Facultad = sequelize.define('Facultad', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    }
}, {
    tableName: 'facultad',
    timestamps: false,
});

module.exports = Facultad;
