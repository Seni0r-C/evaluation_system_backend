// models/index.js
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Calificacion = require('./Calificacion');
const Carrera = require('./Carrera');
const CarreraModalidad = require('./CarreraModalidad');
const EstudianteTrabajo = require('./EstudianteTrabajo');
const Facultad = require('./Facultad');
const ModalidadTitulacion = require('./ModalidadTitulacion');
const TrabajoTitulacion = require('./TrabajoTitulacion');
const Tribunal = require('./Tribunal');

// Exportamos todos los modelos
module.exports = {
    sequelize,
    Usuario,
    Calificacion,
    Carrera,
    CarreraModalidad,
    EstudianteTrabajo,
    Facultad,
    ModalidadTitulacion,
    TrabajoTitulacion,
    Tribunal
};
