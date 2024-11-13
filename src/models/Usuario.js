const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
    UsuarioID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        collate: 'utf8mb4_general_ci' // Asegura la misma collation que en la tabla
    },
    Apellido: {
        type: DataTypes.STRING(100),
        allowNull: false,
        collate: 'utf8mb4_general_ci'
    },
    Email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        collate: 'utf8mb4_general_ci'
    },
    Contrasenia: {
        type: DataTypes.STRING(50),
        allowNull: false,
        collate: 'utf8mb4_general_ci'
    },
    Telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
        collate: 'utf8mb4_general_ci'
    },
    RolID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'rol', // Nombre de la tabla referenciada
            key: 'RolID'  // Nombre de la columna referenciada en la tabla `rol`
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
    }
}, {
    tableName: 'usuario', // Nombre de la tabla en la base de datos
    timestamps: false, // Desactiva las columnas de timestamps si no las necesitas
    charset: 'utf8mb4', // Asegura el mismo charset
    collate: 'utf8mb4_general_ci' // Asegura la misma collation que en la tabla
});

module.exports = Usuario;
