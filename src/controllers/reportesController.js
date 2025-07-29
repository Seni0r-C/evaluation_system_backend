const db = require('../config/db');

// 1. Reporte de estudiantes graduados en un rango de fechas
exports.getGraduados = async (req, res) => {
    const { fechaInicio, fechaFin, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const query = `
            SELECT te.estudiante_id, u.nombre AS estudiante_nombre, tt.titulo, tt.fecha_defensa
            FROM trabajo_estudiante te
            JOIN trabajo_titulacion tt ON te.trabajo_id = tt.id
            JOIN usuario u ON te.estudiante_id = u.id
            WHERE te.resultado = 'Aprobado'
            AND tt.fecha_defensa BETWEEN ? AND ?
            LIMIT ? OFFSET ?
        `;
        const [rows] = await db.query(query, [fechaInicio, fechaFin, parseInt(limit), offset]);

        res.json({
            page: parseInt(page),
            limit: parseInt(limit),
            data: rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el reporte de graduados' });
    }
};

// 2. Reporte de trabajos pendientes por estado
exports.getTrabajosPendientes = async (req, res) => {
    const { estadoId, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const query = `
            SELECT tt.id, tt.titulo, tt.estado_id, te.estudiante_id, u.nombre AS estudiante_nombre
            FROM trabajo_titulacion tt
            LEFT JOIN trabajo_estudiante te ON tt.id = te.trabajo_id
            LEFT JOIN usuario u ON te.estudiante_id = u.id
            WHERE tt.estado_id = ?
            LIMIT ? OFFSET ?
        `;
        const [rows] = await db.query(query, [estadoId, parseInt(limit), offset]);

        res.json({
            page: parseInt(page),
            limit: parseInt(limit),
            data: rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el reporte de trabajos pendientes' });
    }
};

// 3. Reporte de calificaciones promedio por modalidad
exports.getCalificacionesPromedio = async (req, res) => {
    try {
        const query = `
            SELECT smt.nombre AS modalidad, AVG(re.puntaje_obtenido) AS promedio_calificacion
            FROM rubrica_evaluacion re
            JOIN trabajo_titulacion tt ON re.trabajo_id = tt.id
            JOIN sistema_modalidad_titulacion smt ON tt.modalidad_id = smt.id
            GROUP BY smt.nombre
        `;
        const [rows] = await db.query(query);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el reporte de calificaciones promedio' });
    }
};

// 4. Reporte de carga de trabajo de docentes como tutores
exports.getCargaTutores = async (req, res) => {
    try {
        const query = `
            SELECT u.nombre AS tutor_nombre, COUNT(tt.id) AS cantidad_trabajos
            FROM trabajo_titulacion tt
            JOIN usuario u ON tt.tutor_id = u.id
            GROUP BY u.nombre
        `;
        const [rows] = await db.query(query);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el reporte de carga de tutores' });
    }
};

// 5. Reporte de solicitudes de excepción
exports.getSolicitudesExcepcion = async (req, res) => {
    const { estado, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const query = `
            SELECT se.id, se.estado, u.nombre AS estudiante_nombre, tt.titulo
            FROM solicitud_excepcion se
            JOIN usuario u ON se.estudiante_id = u.id
            JOIN trabajo_titulacion tt ON se.trabajo_id = tt.id
            WHERE se.estado = ?
            LIMIT ? OFFSET ?
        `;
        const [rows] = await db.query(query, [estado, parseInt(limit), offset]);

        res.json({
            page: parseInt(page),
            limit: parseInt(limit),
            data: rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el reporte de solicitudes de excepción' });
    }
};

// 6. Reporte de tendencias de rendimiento académico
exports.getTendenciasRendimiento = async (req, res) => {
    try {
        const query = `
            SELECT YEAR(tt.fecha_defensa) AS anio, MONTH(tt.fecha_defensa) AS mes, AVG(re.puntaje_obtenido) AS promedio_calificacion
            FROM rubrica_evaluacion re
            JOIN trabajo_titulacion tt ON re.trabajo_id = tt.id
            GROUP BY YEAR(tt.fecha_defensa), MONTH(tt.fecha_defensa)
            ORDER BY anio, mes
        `;
        const [rows] = await db.query(query);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el reporte de tendencias de rendimiento' });
    }
};

exports.getDashboardSummary = async (req, res) => {
    try {
        const [estadoGeneral] = await db.query(`
            SELECT te.nombre, COUNT(tt.id) AS total
            FROM trabajo_estado te
            LEFT JOIN trabajo_titulacion tt ON te.id = tt.estado_id
            GROUP BY te.nombre
        `);

        const [distribucionModalidad] = await db.query(`
            SELECT smt.nombre, COUNT(tt.id) AS total
            FROM sistema_modalidad_titulacion smt
            LEFT JOIN trabajo_titulacion tt ON smt.id = tt.modalidad_id
            GROUP BY smt.nombre
        `);

        const [graduadosPorMes] = await db.query(`
            SELECT MONTH(fecha_defensa) AS mes, COUNT(id) AS total
            FROM trabajo_titulacion
            WHERE estado_id = 4 AND YEAR(fecha_defensa) = YEAR(CURDATE())
            GROUP BY MONTH(fecha_defensa)
        `);

        const [cargaTutores] = await db.query(`
            SELECT u.nombre AS tutor, COUNT(tt.id) AS total
            FROM usuario u
            LEFT JOIN trabajo_titulacion tt ON u.id = tt.tutor_id
            WHERE u.id IN (SELECT DISTINCT tutor_id FROM trabajo_titulacion)
            GROUP BY u.nombre
        `);

        res.json({
            estadoGeneral,
            distribucionModalidad,
            graduadosPorMes,
            cargaTutores
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el resumen del dashboard' });
    }
};