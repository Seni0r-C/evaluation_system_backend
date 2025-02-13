const db = require('../config/db');

exports.GetByIdTrabajoService = async (id) => {
    const [rows] = await db.execute(`
        SELECT 
            tt.*, 
            c.nombre AS carrera, 
            mt.nombre AS modalidad, 
            ttor.nombre AS tutor, 
            cttor.nombre AS cotutor,
            GROUP_CONCAT(DISTINCT est.nombre) AS estudiantes,
            GROUP_CONCAT(DISTINCT tribunal.nombre) AS tribunal
        FROM trabajo_titulacion tt
        JOIN sistema_carrera c ON tt.carrera_id = c.id
        JOIN sistema_modalidad_titulacion mt ON tt.modalidad_id = mt.id
        JOIN usuario ttor ON tt.tutor_id = ttor.id
        LEFT JOIN usuario cttor ON tt.cotutor_id = cttor.id
        LEFT JOIN trabajo_estudiante te ON tt.id = te.trabajo_id
        LEFT JOIN usuario est ON te.estudiante_id = est.id
        LEFT JOIN trabajo_tribunal ttrib ON tt.id = ttrib.trabajo_id
        LEFT JOIN usuario tribunal ON ttrib.docente_id = tribunal.id
        WHERE tt.id = ?
        GROUP BY tt.id, c.nombre, mt.nombre, ttor.nombre, cttor.nombre
    `, [id]);

    // Convertir resultados de cadena a arrays y ajustar la fecha
    if (rows?.length > 0) {
        if (rows[0]?.estudiantes) {
            rows[0].estudiantes = rows[0].estudiantes.split(',').map(e => e.trim());
        }
        if (rows[0]?.tribunal) {
            rows[0].tribunal = rows[0].tribunal.split(',').map(e => e.trim());
        }
        if (rows[0]?.fecha_defensa) {
            rows[0].fecha_defensa = new Date(rows[0].fecha_defensa).toLocaleString('es-EC', {
                timeZone: 'America/Guayaquil',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hourCycle: 'h23' // Forzar formato de 24 horas
            });
        }

    }

    return rows;
};

// Servicio para obtener el esquema de notas con nombres en lugar de IDs
exports.GetNotasTrabajoService = async (trabajo_id) => {
    const query = `
        SELECT 
            docente.nombre AS docente,
            estudiante.id AS est_id,
            estudiante.nombre AS estudiante,
            te.nombre AS tipo_evaluacion, 
            SUM(re.puntaje_obtenido) AS nota,
            SUM(rc.puntaje_maximo) AS base
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
        GROUP BY te.id, docente.id, estudiante.id ORDER BY estudiante.id`;

    const [rows] = await db.query(query, [trabajo_id]);
    return rows;
};

exports.GetModalidadTrabajoService = async (trabajo_id) => {
    const query = `
        SELECT 
            m.id
        FROM 
            sistema_modalidad_titulacion m
        INNER JOIN trabajo_titulacion tt ON m.id = tt.modalidad_id
        WHERE tt.id = ?
        `;

    const [rows] = await db.query(query, [trabajo_id]);
    return rows[0];
};
