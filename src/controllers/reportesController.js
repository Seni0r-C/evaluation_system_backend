const db = require('../config/db');
const { crearExcel } = require('../services/reportesService');

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
            SELECT
                smt.nombre AS modalidad,
                (SUM(re.puntaje_obtenido) / SUM(rc.puntaje_maximo)) * 100 AS promedio_calificacion_porcentaje
            FROM
                rubrica_evaluacion re
            JOIN
                rubrica_criterio rc ON re.rubrica_criterio_id = rc.id
            JOIN
                rubrica r ON re.rubrica_id = r.id
            JOIN
                sistema_modalidad_titulacion smt ON r.modalidad_id = smt.id
            GROUP BY
                smt.nombre
        `;
        const [rows] = await db.query(query);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el reporte de calificaciones promedio' });
    }
};

exports.getReporteEstudiante = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT
                u.nombre AS estudiante_nombre,
                u.cedula,
                tt.titulo,
                tt.fecha_defensa,
                c.nombre AS carrera,
                m.nombre AS modalidad,
                t.nombre AS tutor,
                (SELECT GROUP_CONCAT(doc.nombre SEPARATOR ', ') FROM usuario doc JOIN trabajo_tribunal tr ON doc.id = tr.docente_id WHERE tr.trabajo_id = tt.id) AS tribunal,
                re.puntaje_obtenido,
                rc.nombre AS criterio_nombre,
                rc.puntaje_maximo,
                ste.nombre AS tipo_evaluacion
            FROM usuario u
            JOIN trabajo_estudiante te ON u.id = te.estudiante_id
            JOIN trabajo_titulacion tt ON te.trabajo_id = tt.id
            JOIN sistema_carrera c ON tt.carrera_id = c.id
            JOIN sistema_modalidad_titulacion m ON tt.modalidad_id = m.id
            JOIN usuario t ON tt.tutor_id = t.id
            LEFT JOIN rubrica_evaluacion re ON tt.id = re.trabajo_id AND u.id = re.estudiante_id
            LEFT JOIN rubrica_criterio rc ON re.rubrica_criterio_id = rc.id
            LEFT JOIN rubrica r ON rc.rubrica_id = r.id
            LEFT JOIN sistema_tipo_evaluacion ste ON r.tipo_evaluacion_id = ste.id
            WHERE u.id = ?
        `;
        const [rows] = await db.query(query, [id]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el reporte del estudiante' });
    }
};

exports.generarReporteEstudiante = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT
                u.nombre AS estudiante_nombre,
                u.cedula,
                tt.titulo,
                tt.fecha_defensa,
                c.nombre AS carrera,
                m.nombre AS modalidad,
                t.nombre AS tutor,
                (SELECT GROUP_CONCAT(doc.nombre SEPARATOR ', ') FROM usuario doc JOIN trabajo_tribunal tr ON doc.id = tr.docente_id WHERE tr.trabajo_id = tt.id) AS tribunal,
                re.puntaje_obtenido,
                rc.nombre AS criterio_nombre,
                rc.puntaje_maximo,
                ste.nombre AS tipo_evaluacion
            FROM usuario u
            JOIN trabajo_estudiante te ON u.id = te.estudiante_id
            JOIN trabajo_titulacion tt ON te.trabajo_id = tt.id
            JOIN sistema_carrera c ON tt.carrera_id = c.id
            JOIN sistema_modalidad_titulacion m ON tt.modalidad_id = m.id
            JOIN usuario t ON tt.tutor_id = t.id
            LEFT JOIN rubrica_evaluacion re ON tt.id = re.trabajo_id AND u.id = re.estudiante_id
            LEFT JOIN rubrica_criterio rc ON re.rubrica_criterio_id = rc.id
            LEFT JOIN rubrica r ON rc.rubrica_id = r.id
            LEFT JOIN sistema_tipo_evaluacion ste ON r.tipo_evaluacion_id = ste.id
            WHERE u.id = ?
        `;
        const [rows] = await db.query(query, [id]);

        const columns = [
            { header: 'Estudiante', key: 'estudiante_nombre' },
            { header: 'Cédula', key: 'cedula' },
            { header: 'Título', key: 'titulo' },
            { header: 'Fecha de Defensa', key: 'fecha_defensa' },
            { header: 'Carrera', key: 'carrera' },
            { header: 'Modalidad', key: 'modalidad' },
            { header: 'Tutor', key: 'tutor' },
            { header: 'Tribunal', key: 'tribunal' },
            { header: 'Tipo de Evaluación', key: 'tipo_evaluacion' },
            { header: 'Criterio', key: 'criterio_nombre' },
            { header: 'Puntaje Máximo', key: 'puntaje_maximo' },
            { header: 'Puntaje Obtenido', key: 'puntaje_obtenido' },
        ];

        const buffer = await crearExcel(rows, columns, `Reporte de Estudiante - ${rows[0].estudiante_nombre}`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=reporte_${rows[0].estudiante_nombre}.xlsx`);
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al generar el reporte del estudiante' });
    }
};

exports.generarReporteCalificacionesPromedio = async (req, res) => {
    try {
        const query = `
            SELECT
                smt.nombre AS modalidad,
                (SUM(re.puntaje_obtenido) / SUM(rc.puntaje_maximo)) * 100 AS promedio_calificacion_porcentaje
            FROM
                rubrica_evaluacion re
            JOIN
                rubrica_criterio rc ON re.rubrica_criterio_id = rc.id
            JOIN
                rubrica r ON re.rubrica_id = r.id
            JOIN
                sistema_modalidad_titulacion smt ON r.modalidad_id = smt.id
            GROUP BY
                smt.nombre
        `;
        const [rows] = await db.query(query);

        const columns = [
            { header: 'Modalidad', key: 'modalidad' },
            { header: 'Promedio Calificación (%)', key: 'promedio_calificacion_porcentaje' },
        ];

        const buffer = await crearExcel(rows, columns, 'Reporte de Calificaciones Promedio');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_calificaciones_promedio.xlsx');
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al generar el reporte de calificaciones promedio' });
    }
};

exports.generarReporteTendenciasRendimiento = async (req, res) => {
    try {
        const query = `
            SELECT
                YEAR(tt.fecha_defensa) AS anio,
                MONTH(tt.fecha_defensa) AS mes,
                smt.nombre AS modalidad,
                AVG(re.puntaje_obtenido) AS promedio_calificacion
            FROM
                rubrica_evaluacion re
            JOIN
                trabajo_titulacion tt ON re.trabajo_id = tt.id
            JOIN
                sistema_modalidad_titulacion smt ON tt.modalidad_id = smt.id
            GROUP BY
                anio, mes, modalidad
            ORDER BY
                anio, mes, modalidad
        `;
        const [rows] = await db.query(query);

        const columns = [
            { header: 'Año', key: 'anio' },
            { header: 'Mes', key: 'mes' },
            { header: 'Modalidad', key: 'modalidad' },
            { header: 'Promedio Calificación', key: 'promedio_calificacion' },
        ];

        const buffer = await crearExcel(rows, columns, 'Reporte de Tendencias de Rendimiento Académico');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_tendencias_rendimiento_academico.xlsx');
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al generar el reporte de tendencias de rendimiento académico' });
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

// 6. Reporte de tendencias de rendimiento académico
exports.getTendenciasRendimiento = async (req, res) => {
    try {
        const query = `
            SELECT
                YEAR(tt.fecha_defensa) AS anio,
                MONTH(tt.fecha_defensa) AS mes,
                smt.nombre AS modalidad,
                AVG(re.puntaje_obtenido) AS promedio_calificacion
            FROM
                rubrica_evaluacion re
            JOIN
                trabajo_titulacion tt ON re.trabajo_id = tt.id
            JOIN
                sistema_modalidad_titulacion smt ON tt.modalidad_id = smt.id
            GROUP BY
                anio, mes, modalidad
            ORDER BY
                anio, mes, modalidad
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
            AND tt.estado_id != 4
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

exports.generarReporteGraduados = async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    try {
        const [rows] = await db.query(`
            SELECT u.nombre AS estudiante, u.cedula, tt.titulo, tt.fecha_defensa, t.nombre AS tutor
            FROM trabajo_estudiante te
            JOIN trabajo_titulacion tt ON te.trabajo_id = tt.id
            JOIN usuario u ON te.estudiante_id = u.id
            JOIN usuario t ON tt.tutor_id = t.id
            WHERE tt.estado_id = 4 AND tt.fecha_defensa BETWEEN ? AND ?
            AND te.resultado = 'Aprobado'
        `, [fechaInicio, fechaFin]);

        const columns = [
            { header: 'Estudiante', key: 'estudiante' },
            { header: 'Cédula', key: 'cedula' },
            { header: 'Título del Trabajo', key: 'titulo' },
            { header: 'Fecha de Defensa', key: 'fecha_defensa' },
            { header: 'Tutor', key: 'tutor' },
        ];

        const buffer = await crearExcel(rows, columns, 'Reporte de Graduados');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_graduados.xlsx');
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al generar el reporte de graduados' });
    }
};

exports.generarReporteCargaTutores = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT u.nombre AS tutor, COUNT(tt.id) AS total
            FROM usuario u
            LEFT JOIN trabajo_titulacion tt ON u.id = tt.tutor_id
            WHERE u.id IN (SELECT DISTINCT tutor_id FROM trabajo_titulacion)
            AND tt.estado_id != 4
            GROUP BY u.nombre
        `);

        const columns = [
            { header: 'Tutor', key: 'tutor' },
            { header: 'Trabajos Asignados', key: 'total' },
        ];

        const buffer = await crearExcel(rows, columns, 'Reporte de Carga de Tutores');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_carga_tutores.xlsx');
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ error: 'Error al generar el reporte de carga de tutores' });
    }
};

exports.generarReporteTrabajosPendientes = async (req, res) => {
    const { estadoId } = req.query;
    try {
        const query = `
            SELECT tt.id, tt.titulo, ts.nombre AS estado, u.nombre AS estudiante_nombre
            FROM trabajo_titulacion tt
            LEFT JOIN trabajo_estudiante te ON tt.id = te.trabajo_id
            LEFT JOIN usuario u ON te.estudiante_id = u.id
            JOIN trabajo_estado ts ON tt.estado_id = ts.id
            WHERE tt.estado_id = ?
        `;
        const [rows] = await db.query(query, [estadoId]);

        const columns = [
            { header: 'ID Trabajo', key: 'id' },
            { header: 'Título', key: 'titulo' },
            { header: 'Estado', key: 'estado' },
            { header: 'Estudiante', key: 'estudiante_nombre' },
        ];

        const buffer = await crearExcel(rows, columns, 'Reporte de Trabajos Pendientes');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_trabajos_pendientes.xlsx');
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al generar el reporte de trabajos pendientes' });
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
            SELECT
                smt.nombre AS modalidad,
                (SUM(re.puntaje_obtenido) / SUM(rc.puntaje_maximo)) * 100 AS promedio_calificacion_porcentaje
            FROM
                rubrica_evaluacion re
            JOIN
                rubrica_criterio rc ON re.rubrica_criterio_id = rc.id
            JOIN
                rubrica r ON re.rubrica_id = r.id
            JOIN
                sistema_modalidad_titulacion smt ON r.modalidad_id = smt.id
            GROUP BY
                smt.nombre
        `;
        const [rows] = await db.query(query);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el reporte de calificaciones promedio' });
    }
};

exports.getReporteEstudiante = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT
                u.nombre AS estudiante_nombre,
                u.cedula,
                tt.titulo,
                tt.fecha_defensa,
                c.nombre AS carrera,
                m.nombre AS modalidad,
                t.nombre AS tutor,
                (SELECT GROUP_CONCAT(doc.nombre SEPARATOR ', ') FROM usuario doc JOIN trabajo_tribunal tr ON doc.id = tr.docente_id WHERE tr.trabajo_id = tt.id) AS tribunal,
                re.puntaje_obtenido,
                rc.nombre AS criterio_nombre,
                rc.puntaje_maximo,
                ste.nombre AS tipo_evaluacion
            FROM usuario u
            JOIN trabajo_estudiante te ON u.id = te.estudiante_id
            JOIN trabajo_titulacion tt ON te.trabajo_id = tt.id
            JOIN sistema_carrera c ON tt.carrera_id = c.id
            JOIN sistema_modalidad_titulacion m ON tt.modalidad_id = m.id
            JOIN usuario t ON tt.tutor_id = t.id
            LEFT JOIN rubrica_evaluacion re ON tt.id = re.trabajo_id AND u.id = re.estudiante_id
            LEFT JOIN rubrica_criterio rc ON re.rubrica_criterio_id = rc.id
            LEFT JOIN rubrica r ON rc.rubrica_id = r.id
            LEFT JOIN sistema_tipo_evaluacion ste ON r.tipo_evaluacion_id = ste.id
            WHERE u.id = ?
        `;
        const [rows] = await db.query(query, [id]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el reporte del estudiante' });
    }
};

exports.generarReporteCalificacionesPromedio = async (req, res) => {
    try {
        const query = `
            SELECT
                smt.nombre AS modalidad,
                (SUM(re.puntaje_obtenido) / SUM(rc.puntaje_maximo)) * 100 AS promedio_calificacion_porcentaje
            FROM
                rubrica_evaluacion re
            JOIN
                rubrica_criterio rc ON re.rubrica_criterio_id = rc.id
            JOIN
                rubrica r ON re.rubrica_id = r.id
            JOIN
                sistema_modalidad_titulacion smt ON r.modalidad_id = smt.id
            GROUP BY
                smt.nombre
        `;
        const [rows] = await db.query(query);

        const columns = [
            { header: 'Modalidad', key: 'modalidad' },
            { header: 'Promedio Calificación (%)', key: 'promedio_calificacion_porcentaje' },
        ];

        const buffer = await crearExcel(rows, columns, 'Reporte de Calificaciones Promedio');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_calificaciones_promedio.xlsx');
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al generar el reporte de calificaciones promedio' });
    }
};

exports.generarReporteTendenciasRendimiento = async (req, res) => {
    try {
        const query = `
            SELECT
                YEAR(tt.fecha_defensa) AS anio,
                MONTH(tt.fecha_defensa) AS mes,
                smt.nombre AS modalidad,
                AVG(re.puntaje_obtenido) AS promedio_calificacion
            FROM
                rubrica_evaluacion re
            JOIN
                trabajo_titulacion tt ON re.trabajo_id = tt.id
            JOIN
                sistema_modalidad_titulacion smt ON tt.modalidad_id = smt.id
            GROUP BY
                anio, mes, modalidad
            ORDER BY
                anio, mes, modalidad
        `;
        const [rows] = await db.query(query);

        const columns = [
            { header: 'Año', key: 'anio' },
            { header: 'Mes', key: 'mes' },
            { header: 'Modalidad', key: 'modalidad' },
            { header: 'Promedio Calificación', key: 'promedio_calificacion' },
        ];

        const buffer = await crearExcel(rows, columns, 'Reporte de Tendencias de Rendimiento Académico');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_tendencias_rendimiento_academico.xlsx');
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al generar el reporte de tendencias de rendimiento académico' });
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

// 6. Reporte de tendencias de rendimiento académico
exports.getTendenciasRendimiento = async (req, res) => {
    try {
        const query = `
            SELECT
                YEAR(tt.fecha_defensa) AS anio,
                MONTH(tt.fecha_defensa) AS mes,
                smt.nombre AS modalidad,
                AVG(re.puntaje_obtenido) AS promedio_calificacion
            FROM
                rubrica_evaluacion re
            JOIN
                trabajo_titulacion tt ON re.trabajo_id = tt.id
            JOIN
                sistema_modalidad_titulacion smt ON tt.modalidad_id = smt.id
            GROUP BY
                anio, mes, modalidad
            ORDER BY
                anio, mes, modalidad
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
            AND tt.estado_id != 4
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

exports.generarReporteGraduados = async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    try {
        const [rows] = await db.query(`
            SELECT u.nombre AS estudiante, u.cedula, tt.titulo, tt.fecha_defensa, t.nombre AS tutor
            FROM trabajo_estudiante te
            JOIN trabajo_titulacion tt ON te.trabajo_id = tt.id
            JOIN usuario u ON te.estudiante_id = u.id
            JOIN usuario t ON tt.tutor_id = t.id
            WHERE tt.estado_id = 4 AND tt.fecha_defensa BETWEEN ? AND ?
            AND te.resultado = 'Aprobado'
        `, [fechaInicio, fechaFin]);

        const columns = [
            { header: 'Estudiante', key: 'estudiante' },
            { header: 'Cédula', key: 'cedula' },
            { header: 'Título del Trabajo', key: 'titulo' },
            { header: 'Fecha de Defensa', key: 'fecha_defensa' },
            { header: 'Tutor', key: 'tutor' },
        ];

        const buffer = await crearExcel(rows, columns, 'Reporte de Graduados');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_graduados.xlsx');
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al generar el reporte de graduados' });
    }
};

exports.generarReporteCargaTutores = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT u.nombre AS tutor, COUNT(tt.id) AS total
            FROM usuario u
            LEFT JOIN trabajo_titulacion tt ON u.id = tt.tutor_id
            WHERE u.id IN (SELECT DISTINCT tutor_id FROM trabajo_titulacion)
            AND tt.estado_id != 4
            GROUP BY u.nombre
        `);

        const columns = [
            { header: 'Tutor', key: 'tutor' },
            { header: 'Trabajos Asignados', key: 'total' },
        ];

        const buffer = await crearExcel(rows, columns, 'Reporte de Carga de Tutores');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_carga_tutores.xlsx');
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ error: 'Error al generar el reporte de carga de tutores' });
    }
};

exports.generarReporteTrabajosPendientes = async (req, res) => {
    const { estadoId } = req.query;
    try {
        const query = `
            SELECT tt.id, tt.titulo, ts.nombre AS estado, u.nombre AS estudiante_nombre
            FROM trabajo_titulacion tt
            LEFT JOIN trabajo_estudiante te ON tt.id = te.trabajo_id
            LEFT JOIN usuario u ON te.estudiante_id = u.id
            JOIN trabajo_estado ts ON tt.estado_id = ts.id
            WHERE tt.estado_id = ?
        `;
        const [rows] = await db.query(query, [estadoId]);

        const columns = [
            { header: 'ID Trabajo', key: 'id' },
            { header: 'Título', key: 'titulo' },
            { header: 'Estado', key: 'estado' },
            { header: 'Estudiante', key: 'estudiante_nombre' },
        ];

        const buffer = await crearExcel(rows, columns, 'Reporte de Trabajos Pendientes');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_trabajos_pendientes.xlsx');
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al generar el reporte de trabajos pendientes' });
    }
};