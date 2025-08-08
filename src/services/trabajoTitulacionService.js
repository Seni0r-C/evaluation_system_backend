const db = require('../config/db');
const { parseToLocale } = require('../utils/dateUtility');

exports.GetByIdTrabajoService = async (id, unpack = false) => {
    const [rows] = await db.execute(`
        SELECT 
            tt.*, 
            c.nombre AS carrera, 
            mt.nombre AS modalidad, 
            ttor.nombre AS tutor, 
            cttor.nombre AS cotutor,
            GROUP_CONCAT(DISTINCT est.nombre) AS estudiantes,
            GROUP_CONCAT(DISTINCT trol.nombre, ':<br> ', tribunal.nombre) AS tribunal
        FROM trabajo_titulacion tt
        JOIN sistema_carrera c ON tt.carrera_id = c.id
        JOIN sistema_modalidad_titulacion mt ON tt.modalidad_id = mt.id
        JOIN usuario ttor ON tt.tutor_id = ttor.id
        LEFT JOIN usuario cttor ON tt.cotutor_id = cttor.id
        LEFT JOIN trabajo_estudiante te ON tt.id = te.trabajo_id
        LEFT JOIN usuario est ON te.estudiante_id = est.id
        LEFT JOIN trabajo_tribunal ttrib ON tt.id = ttrib.trabajo_id
        LEFT JOIN tribunal_rol trol ON ttrib.tribunal_rol_id = trol.id
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
            rows[0].fecha_defensa = parseToLocale(rows[0].fecha_defensa);
            console.log(rows[0].fecha_defensa);
        }

    }

    return unpack ? rows[0] : rows;
};

// Servicio para obtener el esquema de notas con nombres en lugar de IDs
exports.GetNotasTrabajoService = async (trabajo_id) => {
    const query = `
        SELECT 
            docente.nombre AS docente,
            estudiante.id AS est_id,
            estudiante.cedula AS cedula,
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

// Servicio para obtener el esquema de notas con nombres en lugar de IDs
exports.GetNotasByEvalTypeTrabajoService = async (trabajo_id, eval_type) => {
    const query = `
        SELECT 
            docente.nombre AS docente,
            estudiante.id AS est_id,
            estudiante.cedula AS cedula,
            estudiante.nombre AS estudiante,
            te.nombre AS tipo_evaluacion, 
            r.tipo_evaluacion_id AS eval_type,
            rc.nombre AS nombre,
            re.puntaje_obtenido AS nota,
            rc.puntaje_maximo AS base,
            te_hijo.nombre AS componente
        FROM 
            rubrica_evaluacion re
        INNER JOIN 
            rubrica_criterio rc ON re.rubrica_criterio_id = rc.id
        INNER JOIN 
            usuario docente ON re.docente_id = docente.id
        INNER JOIN 
            usuario estudiante ON re.estudiante_id = estudiante.id
        INNER JOIN  
            rubrica r ON rc.rubrica_id = r.id
        INNER JOIN 
            sistema_tipo_evaluacion te ON r.tipo_evaluacion_id = te.id
        INNER JOIN 
            sistema_modalidad_titulacion m ON r.modalidad_id = m.id
        INNER JOIN 
            trabajo_titulacion tt ON re.trabajo_id = tt.id
        LEFT JOIN 
            acta_notas_scheme ans ON te.id = ans.comp_parent_id
        LEFT JOIN 
            sistema_tipo_evaluacion te_hijo ON ans.comp_id = te_hijo.id
        WHERE 
            tt.id = ? ${(eval_type??false) && eval_type>0 ? 'AND te.id = ?' : ''}
        ORDER BY 
            estudiante, tipo_evaluacion;`;

    const [rows] = await db.query(query, [trabajo_id, eval_type]);
    return rows;
};
// exports.GetNotasByEvalTypeTrabajoService = async (trabajo_id, eval_type) => {
//     const query = `
//          SELECT 
//             docente.nombre AS docente,
//             estudiante.id AS est_id,
//             estudiante.cedula AS cedula,
//             estudiante.nombre AS estudiante,
//             te.nombre AS tipo_evaluacion, 
//             r.tipo_evaluacion_id AS eval_type,
//             rc.nombre AS nombre,
//             re.puntaje_obtenido AS nota,
//             rc.puntaje_maximo AS base
//         FROM 
//             rubrica_evaluacion re
//         INNER JOIN 
//             rubrica_criterio rc ON re.rubrica_criterio_id = rc.id
//         INNER JOIN 
//             usuario docente ON re.docente_id = docente.id
//         INNER JOIN 
//             usuario estudiante ON re.estudiante_id = estudiante.id
//         INNER JOIN  rubrica r ON rc.rubrica_id = r.id
//         INNER JOIN 
//             sistema_tipo_evaluacion te ON r.tipo_evaluacion_id = te.id
//         INNER JOIN 
//             sistema_modalidad_titulacion m ON r.modalidad_id = m.id
//         INNER JOIN trabajo_titulacion tt ON re.trabajo_id = tt.id
//         WHERE tt.id = ? ${(eval_type??false) && eval_type>0 ? 'AND te.id = ?' : ''} 
//         ORDER BY estudiante, tipo_evaluacion`;

//     const [rows] = await db.query(query, [trabajo_id, eval_type]);
//     return rows;
// };

exports.GetModalidadTrabajoService = async (trabajo_id) => {
    const query = `
        SELECT 
            m.id, m.nombre
        FROM 
            sistema_modalidad_titulacion m
        INNER JOIN trabajo_titulacion tt ON m.id = tt.modalidad_id
        WHERE tt.id = ?
        `;

    const [rows] = await db.query(query, [trabajo_id]);
    return rows[0];
};


exports.GetEstudiantesTrabajoService = async (trabajo_id) => {
    const query = `
        SELECT 
            u.id, u.nombre, u.cedula
        FROM 
            usuario u
        INNER JOIN trabajo_estudiante te ON u.id = te.estudiante_id
        WHERE te.trabajo_id = ?
        `;

    const [rows] = await db.query(query, [trabajo_id]);
    return rows;
};

exports.GetEstadoTrabajoService = async (trabajo_id) => {
    const query = `
        SELECT 
            te.id, te.nombre
        FROM 
            trabajo_estado te
        INNER JOIN trabajo_titulacion tt ON te.id = tt.estado_id
        WHERE tt.id = ?
        `;

    const [rows] = await db.query(query, [trabajo_id]);
    return rows[0];
};

exports.GetTribunalTrabajoService = async (trabajo_id) => {
    const query = `
        SELECT 
            u.id, u.nombre, u.cedula
        FROM 
            usuario u
        INNER JOIN trabajo_tribunal tt ON u.id = tt.docente_id
        WHERE tt.trabajo_id = ?
        `;

    const [rows] = await db.query(query, [trabajo_id]);
    return rows;
};

exports.GetTutorTrabajoService = async (trabajo_id) => {
    const query = `
        SELECT 
            u.id, u.nombre, u.cedula
        FROM 
            usuario u
        INNER JOIN trabajo_titulacion tt ON u.id = tt.tutor_id
        WHERE tt.id = ?
        `;

    const [rows] = await db.query(query, [trabajo_id]);
    return rows[0];
};

exports.GetCoTutorTrabajoService = async (trabajo_id) => {
    const query = `
        SELECT 
            u.id, u.nombre, u.cedula
        FROM 
            usuario u
        INNER JOIN trabajo_titulacion tt ON u.id = tt.cotutor_id
        WHERE tt.id = ?
        `;

    const [rows] = await db.query(query, [trabajo_id]);
    return rows[0];
};

exports.GetFullInfoTrabajoService = async (trabajo_id) => {
    const trabajo = await this.GetByIdTrabajoService(trabajo_id, true);
    const modalidad = await this.GetModalidadTrabajoService(trabajo_id);
    const estudiantes = await this.GetEstudiantesTrabajoService(trabajo_id);
    const estado = await this.GetEstadoTrabajoService(trabajo_id);
    const tribunal = await this.GetTribunalTrabajoService(trabajo_id);
    const tutor = await this.GetTutorTrabajoService(trabajo_id);
    const cotutor = await this.GetCoTutorTrabajoService(trabajo_id);
    const notas = await this.GetNotasTrabajoService(trabajo_id);

    return {
        ...trabajo,
        modalidad,
        estudiantes,
        estado,
        tribunal,
        tutor,
        cotutor,
        notas
    };
};

exports.updateStudentStatusByTrabajoId = async (trabajo_id, status) => {
    const query = `
        UPDATE trabajo_estudiante
        SET resultado = ?
        WHERE trabajo_id = ?
    `;
    const [result] = await db.query(query, [status, trabajo_id]);
    return result;
};