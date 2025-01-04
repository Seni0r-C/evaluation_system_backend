const db = require('../config/db');

// Crear un nuevo trabajo de titulación
exports.crearTrabajo = async (req, res) => {
    const { carrera_id, modalidad_id, tutor_id, cotutor_id, titulo, link_archivo } = req.body;
    try {
        // Verificar si ya existe un trabajo con el mismo título
        const [existingTitle] = await db.execute(
            'SELECT id FROM trabajo_titulacion WHERE titulo = ?',
            [titulo]
        );

        if (existingTitle.length > 0) {
            // Si existe, devolver un error indicando que el título ya está en uso
            return res.status(400).json({ error: 'Ya existe un trabajo con ese título' });
        }

        // Verificar si la modalidad existe
        const [modalidad] = await db.execute(
            'SELECT max_participantes FROM modalidad_titulacion WHERE id = ?',
            [modalidad_id]
        );

        if (!modalidad.length) {
            return res.status(400).json({ error: 'Modalidad no encontrada' });
        }

        // Crear el nuevo trabajo de titulación
        const [result] = await db.execute(
            `INSERT INTO trabajo_titulacion 
            (carrera_id, modalidad_id, tutor_id, cotutor_id, titulo, link_archivo) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [carrera_id, modalidad_id, tutor_id, cotutor_id || null, titulo, link_archivo]
        );

        // Responder con éxito
        res.status(201).json({ id: result.insertId, titulo });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Listar todos los trabajos de titulación
exports.listarTrabajos = async (req, res) => {
    try {
        const { page = 1, limit = 10, carrera_id, modalidad_id, estado, titulo, fecha_defensa } = req.query;

        // Validación y conversión de parámetros de paginación
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        if (isNaN(pageNumber) || pageNumber < 1) {
            return res.status(400).json({ error: "El parámetro 'page' debe ser un número mayor o igual a 1." });
        }

        if (isNaN(limitNumber) || limitNumber < 1) {
            return res.status(400).json({ error: "El parámetro 'limit' debe ser un número mayor o igual a 1." });
        }

        // Calculando el offset para la paginación
        const offset = (pageNumber - 1) * limitNumber;

        // Generando la cláusula WHERE dinámica según los filtros
        let whereClauses = [];
        let queryParams = [];

        if (carrera_id) {
            whereClauses.push('tt.carrera_id = ?');
            queryParams.push(carrera_id);
        }

        if (modalidad_id) {
            whereClauses.push('tt.modalidad_id = ?');
            queryParams.push(modalidad_id);
        }
        
        if (estado) {            
            whereClauses.push('tte.nombre = ?');
            queryParams.push(estado);
        }

        if (titulo) {
            whereClauses.push('tt.titulo LIKE ?');
            queryParams.push(`%${titulo}%`);
        }

        if (fecha_defensa) {
            whereClauses.push('tt.fecha_defensa = ?');
            queryParams.push(fecha_defensa);
        }

        // Unir todas las cláusulas WHERE si existen
        const whereQuery = whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : '';
        const innerJoins = `
            JOIN sistema_carrera c ON tt.carrera_id = c.id
            JOIN trabajo_estado tte ON tt.estado_id = tte.id
            JOIN modalidad_titulacion mt ON tt.modalidad_id = mt.id
        `
        // Consulta para obtener los trabajos de titulación con filtros y paginación
        const [rows] = await db.execute(`
            SELECT tt.*, tte.nombre AS estado, c.nombre AS carrera, mt.nombre AS modalidad
            FROM trabajo_titulacion tt
            ${innerJoins}
            ${whereQuery}
            LIMIT ? OFFSET ?
        `, [...queryParams, limitNumber, offset]);

        // Consulta para contar el total de trabajos sin paginación, solo con filtros
        const [totalRows] = await db.execute(`
            SELECT COUNT(*) AS total
            FROM trabajo_titulacion tt
            ${innerJoins}
            ${whereQuery}
        `, queryParams);

        // Enviar la respuesta con los trabajos y el total de registros
        res.json({
            data: rows,
            total: totalRows[0].total,
            page: pageNumber,
            totalPages: Math.ceil(totalRows[0].total / limitNumber)
        });

    } catch (error) {
        console.error("Error al listar trabajos de titulación:", error.message);
        res.status(500).json({ error: "Ocurrió un error al procesar la solicitud. Por favor, intente nuevamente más tarde." });
    }
};
const getTrabajoByID = async (id) => {
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
        JOIN modalidad_titulacion mt ON tt.modalidad_id = mt.id
        JOIN usuario ttor ON tt.tutor_id = ttor.id
        LEFT JOIN usuario cttor ON tt.cotutor_id = cttor.id
        LEFT JOIN trabajo_estudiante te ON tt.id = te.trabajo_id
        LEFT JOIN usuario est ON te.estudiante_id = est.id
        LEFT JOIN trabajo_tribunal ttrib ON tt.id = ttrib.trabajo_id
        LEFT JOIN usuario tribunal ON ttrib.docente_id = tribunal.id
        WHERE tt.id = ?
        GROUP BY 
            tt.id, c.nombre, mt.nombre, ttor.nombre, cttor.nombre
    `, [id]);

    // Convertir resultados de cadena a arrays
    if (rows?.length > 0) {
        if (rows[0]?.estudiantes) {
            rows[0].estudiantes = rows[0].estudiantes.split(',').map(e => e.trim());
        }
        if (rows[0]?.tribunal) {
            rows[0].tribunal = rows[0].tribunal.split(',').map(e => e.trim());
        }
    }

    return rows;
};


// Obtener un trabajo de titulación por su ID
exports.obtenerTrabajo = async (req, res) => {
    const { id } = req.params;    
    try {
        const rows = await getTrabajoByID(id);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Trabajo no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener los estados de un trabajo de titulación
exports.obtenerEstados = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT id, nombre FROM trabajo_estado`
        );
        res.json({
            exito: true,
            mensaje: 'Estados de trabajo de titulación',
            estados: rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un trabajo de titulación
exports.actualizarTrabajo = async (req, res) => {
    const { id } = req.params;
    const { titulo, estado, fecha_defensa, link_archivo } = req.body;
    try {
        const [result] = await db.execute(`
            UPDATE trabajo_titulacion 
            SET titulo = ?, estado = ?, fecha_defensa = ?, link_archivo = ?
            WHERE id = ?`,
            [titulo, estado, fecha_defensa || null, link_archivo, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Trabajo no encontrado' });
        }
        res.json({ id, titulo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un trabajo de titulación
exports.eliminarTrabajo = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute('DELETE FROM trabajo_titulacion WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Trabajo no encontrado' });
        }
        res.json({ message: 'Trabajo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Asociar un estudiante a un trabajo de titulación
exports.asociarEstudiante = async (req, res) => {
    const { trabajo_id, estudiante_id } = req.body;
    try {
        const [result] = await db.execute(`
            INSERT INTO trabajo_estudiante (trabajo_id, estudiante_id) VALUES (?, ?)`,
            [trabajo_id, estudiante_id]
        );
        res.status(201).json({ id: result.insertId, trabajo_id, estudiante_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Desasociar un estudiante de un trabajo de titulación
exports.desasociarEstudiante = async (req, res) => {
    const { trabajo_id, estudiante_id } = req.body;
    try {
        const [result] = await db.execute(`
            DELETE FROM trabajo_estudiante WHERE trabajo_id = ? AND estudiante_id = ?`,
            [trabajo_id, estudiante_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Asociación no encontrada' });
        }
        res.json({ message: 'Estudiante desasociado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Asignar Tribunal (Verifica si ya existen docentes asignados)
exports.asignarTribunal = async (req, res) => {
    console.log(req.body);
    const { trabajo_id, docente_ids } = req.body;

    try {
        if (!trabajo_id) {
            return res.status(400).json({ error: 'El trabajo_id es obligatorio.' });
        }

        if (!Array.isArray(docente_ids) || docente_ids.length === 0) {
            return res.status(400).json({ error: 'Debe proporcionar al menos un docente válido.' });
        }

        // Verificar si ya hay docentes asignados
        const [existingRows] = await db.execute(
            `SELECT docente_id FROM trabajo_tribunal WHERE trabajo_id = ?`,
            [trabajo_id]
        );

        const existingDocenteIds = existingRows.map(row => row.docente_id);

        if (existingDocenteIds.length > 0) {
            return res.status(400).json({
                error: 'Ya existen docentes asignados a este trabajo. ¿Deseas reemplazarlos?',
                existingDocenteIds
            });
        }

        // Si no hay docentes previos, proceder con la asignación
        return await module.exports.reasignarTribunal(req, res); // Llama a la función de reasignación

    } catch (error) {
        console.error('Error al asignar tribunal:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// Reasignar Tribunal (Inserta solo docentes no asignados previamente)
exports.reasignarTribunal = async (req, res) => {
    console.log(req.body);
    const { trabajo_id, docente_ids } = req.body;

    try {
        if (!trabajo_id) {
            return res.status(400).json({ error: 'El trabajo_id es obligatorio.' });
        }

        if (!Array.isArray(docente_ids) || docente_ids.length === 0) {
            return res.status(400).json({ error: 'Debe proporcionar al menos un docente válido.' });
        }

        // Obtener los docentes actualmente asignados al trabajo
        const [existingRows] = await db.execute(
            `SELECT docente_id FROM trabajo_tribunal WHERE trabajo_id = ?`,
            [trabajo_id]
        );
        const existingDocenteIds = existingRows.map(row => row.docente_id);

        // Obtener los ids de la solicitud
        const requestedDocenteIds = docente_ids.map(docente => docente.id);

        // Verificar si se debe realizar un reemplazo completo
        const idsAreDifferent = requestedDocenteIds.some(id => !existingDocenteIds.includes(id));
        const sameLength = requestedDocenteIds.length === existingDocenteIds.length;

        if (idsAreDifferent && sameLength) {
            // Reemplazo completo: eliminar y volver a insertar
            await db.execute(`DELETE FROM trabajo_tribunal WHERE trabajo_id = ?`, [trabajo_id]);

            const placeholders = docente_ids.map(() => '(?, ?)').join(', ');
            const flattenedValues = docente_ids.map(docente => [trabajo_id, docente.id]).flat();

            const query = `
                INSERT INTO trabajo_tribunal (trabajo_id, docente_id) 
                VALUES ${placeholders}`;

            const [result] = await db.execute(query, flattenedValues);

            return res.status(200).json({
                message: 'Los docentes han sido reemplazados correctamente.',
                insertedCount: result.affectedRows
            });
        }

        // Filtrar e insertar solo los docentes no existentes
        const newValues = docente_ids
            .filter(docente => docente?.id && !existingDocenteIds.includes(docente.id))
            .map(docente => [trabajo_id, docente.id]);

        if (newValues.length > 0) {
            const placeholders = newValues.map(() => '(?, ?)').join(', ');
            const flattenedValues = newValues.flat();

            const query = `
                INSERT INTO trabajo_tribunal (trabajo_id, docente_id) 
                VALUES ${placeholders}`;

            const [result] = await db.execute(query, flattenedValues);

            return res.status(201).json({
                message: 'Se han añadido nuevos docentes al tribunal.',
                insertedCount: result.affectedRows
            });
        }

        // Ningún cambio realizado
        res.status(200).json({
            message: 'No se realizaron cambios, los docentes ya estaban correctamente asignados.'
        });

    } catch (error) {
        console.error('Error al reasignar tribunal:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};



exports.obtenerTribunal = async (req, res) => {
    const { id } = req.params;
    const trabajo_id = id;
    try {
        // Validar la entrada
        if (!trabajo_id) {
            return res.status(400).json({ error: 'El trabajo_id es obligatorio.' });
        }

        // Consulta para obtener los docentes asociados al trabajo con información de la tabla usuario
        const query = `
            SELECT u.id, u.usuario, u.id_personal, u.nombre
            FROM trabajo_tribunal tt
            JOIN usuario u ON tt.docente_id = u.id
            WHERE tt.trabajo_id = ?;
        `;

        const [results] = await db.execute(query, [trabajo_id]);

        // Validar si no existen docentes asociados
        if (results.length === 0) {
            return res.status(404).json({
                message: 'No se encontraron docentes asociados a este trabajo.'
            });
        }

        // Respuesta exitosa con la lista de docentes
        res.status(200).json({
            message: 'Docentes obtenidos correctamente.',
            data: results
        });

    } catch (error) {
        console.error('Error al obtener el tribunal:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};


// Remover un tribunal de un trabajo de titulación
exports.removerTribunal = async (req, res) => {
    const { trabajo_id, docente_id } = req.body;
    try {
        const [result] = await db.execute(`
            DELETE FROM trabajo_tribunal WHERE trabajo_id = ? AND docente_id = ?`,
            [trabajo_id, docente_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Tribunal no encontrado' });
        }
        res.json({ message: 'Tribunal removido correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
