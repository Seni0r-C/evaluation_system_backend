const db = require('../config/db');



const getTribunalMembersGradesStatement = () => {
    return `
     SELECT 
            docente.nombre AS docente,
            estudiante.id AS est_id,
            estudiante.id AS cedula,
            estudiante.nombre AS estudiante,
            te.nombre AS tipo_evaluacion, 
            r.tipo_evaluacion_id AS eval_type,
            rc.nombre AS nombre,
            re.puntaje_obtenido AS nota,
            rc.puntaje_maximo AS base
        FROM 
            rubrica_evaluacion re
        INNER JOIN 
            rubrica_criterio rc ON re.rubrica_criterio_id = rc.id
        INNER JOIN 
            usuario docente ON re.docente_id = docente.id
        INNER JOIN 
            usuario estudiante ON re.estudiante_id = estudiante.id
        INNER JOIN  rubrica r ON rc.rubrica_id = r.id
        INNER JOIN 
            sistema_tipo_evaluacion te ON r.tipo_evaluacion_id = te.id
        INNER JOIN 
            sistema_modalidad_titulacion m ON r.modalidad_id = m.id
        INNER JOIN trabajo_titulacion tt ON re.trabajo_id = tt.id
        WHERE tt.id = ? 
        ORDER BY estudiante, tipo_evaluacion
    `;
}

// Servicio para obtener el nombre de un usuario
exports.GetTribunalMembersGradesService = async (trabajo_id) => {
    const [rows] = await db.query(`${getTribunalMembersGradesStatement()}`, [trabajo_id]);
    return rows;
}