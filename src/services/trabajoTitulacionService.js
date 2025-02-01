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
