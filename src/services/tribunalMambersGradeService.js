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
 

const getTribunalMembersByTrabajoIdStatement = () => {
    return `
        SELECT DISTINCT 
            u.id AS id, 
            u.nombre AS nombre,
            CASE 
                WHEN EXISTS (
                    SELECT 1 
                    FROM rubrica_evaluacion re2
                    JOIN rubrica_criterio rc2 ON re2.rubrica_criterio_id = rc2.id
                    JOIN rubrica r2 ON rc2.rubrica_id = r2.id
                    JOIN sistema_tipo_evaluacion ste2 ON r2.tipo_evaluacion_id = ste2.id
                    WHERE 
                        re2.docente_id = tt.docente_id
                        AND re2.trabajo_id = tt.trabajo_id
                        AND ste2.nombre NOT LIKE '%EXAMEN TEORICO%'
                ) THEN 'CALIFICADO' 
                ELSE 'PENDIENTE' 
            END AS estado
        FROM 
            trabajo_tribunal tt
        INNER JOIN 
            usuario u ON tt.docente_id = u.id
        LEFT JOIN 
            rubrica_evaluacion re ON tt.trabajo_id = re.trabajo_id 
            AND tt.docente_id = re.docente_id
        WHERE 
            tt.trabajo_id = ?
        ORDER BY u.nombre;
    `;
};


exports.GetTribunalMembersByTrabajoIdService = async (trabajo_id) => {
    const [rows] = await db.query(`${getTribunalMembersByTrabajoIdStatement()}`, [trabajo_id]);
    return rows;
}
