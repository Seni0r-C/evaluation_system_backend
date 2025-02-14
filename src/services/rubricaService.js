// services/rubricaService.js
const db = require('../config/db');

// Obtener todas las modalidades
const getModalidades = async () => {
    const [rows] = await db.execute('SELECT id, nombre FROM sistema_modalidad_titulacion');
    return rows;
};

// Obtener todos los tipos de evaluación
const getTiposEvaluacion = async () => {
    const [rows] = await db.execute('SELECT id, nombre FROM sistema_tipo_evaluacion');
    return rows;
};

// Obtener criterios de rúbrica por modalidad y tipo de evaluación
const getCriteriosRubrica = async (modalidadId, tipoEvaluacionId) => {
    const [rows] = await db.execute(`
        SELECT rc.id AS criterio_id, rc.nombre AS criterio_nombre, rc.puntaje_maximo,
               r.id AS rubrica_id, te.id AS tipo_evaluacion_id, te.nombre AS tipo_evaluacion_nombre,
               m.id AS modalidad_id, m.nombre AS modalidad_nombre
        FROM rubrica_criterio rc
        JOIN rubrica r ON rc.rubrica_id = r.id
        JOIN sistema_tipo_evaluacion te ON r.tipo_evaluacion_id = te.id
        JOIN sistema_modalidad_titulacion m ON r.modalidad_id = m.id
        WHERE r.modalidad_id = ? AND r.tipo_evaluacion_id = ?`, 
        [modalidadId, tipoEvaluacionId]);
    return rows;
};

// Actualizar criterio de rúbrica
const updateCriterioRubrica = async (id, nombre, puntaje_maximo) => {
    const [result] = await db.execute(
        'UPDATE rubrica_criterio SET nombre = ?, puntaje_maximo = ? WHERE id = ?',
        [nombre, puntaje_maximo, id]
    );
    return result.affectedRows > 0;
};

module.exports = {
    getModalidades,
    getTiposEvaluacion,
    getCriteriosRubrica,
    updateCriterioRubrica
};