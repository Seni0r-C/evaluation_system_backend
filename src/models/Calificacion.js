// models/Calificacion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const EstudianteTrabajo = require('./EstudianteTrabajo');

const Calificacion = sequelize.define('Calificacion', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_estudiante_trabajo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: EstudianteTrabajo,
            key: 'id'
        }
    },
    id_profesor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id'
        }
    },
    tipo: {
        type: DataTypes.ENUM('escrito', 'oral'),
        allowNull: false,
    },
    calificacion: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.00,
    }
}, {
    tableName: 'calificacion',
    timestamps: false,
});

Calificacion.belongsTo(Usuario, { foreignKey: 'id_profesor' });
Calificacion.belongsTo(EstudianteTrabajo, { foreignKey: 'id_estudiante_trabajo' });

module.exports = Calificacion;
