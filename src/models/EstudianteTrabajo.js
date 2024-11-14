// models/EstudianteTrabajo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const TrabajoTitulacion = require('./TrabajoTitulacion');

const EstudianteTrabajo = sequelize.define('EstudianteTrabajo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_trabajo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_estudiante: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'estudiante_trabajo',
  timestamps: false,
});

EstudianteTrabajo.belongsTo(Usuario, { foreignKey: 'id_estudiante' });
EstudianteTrabajo.belongsTo(TrabajoTitulacion, { foreignKey: 'id_trabajo' });

module.exports = EstudianteTrabajo;
