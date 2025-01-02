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
            res.json({
                estado: estado,
            });
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


// Obtener un trabajo de titulación por su ID
exports.obtenerTrabajo = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute(`
            SELECT tt.*, c.nombre AS carrera, mt.nombre AS modalidad
            FROM trabajo_titulacion tt
            JOIN sistema_carrera c ON tt.carrera_id = c.id
            JOIN modalidad_titulacion mt ON tt.modalidad_id = mt.id
            WHERE tt.id = ?`,
            [id]
        );
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

// Asignar un tribunal a un trabajo de titulación
exports.asignarTribunal = async (req, res) => {
    const { trabajo_id, docente_id } = req.body;
    try {
        const [result] = await db.execute(`
            INSERT INTO trabajo_tribunal (trabajo_id, docente_id) VALUES (?, ?)`,
            [trabajo_id, docente_id]
        );
        res.status(201).json({ id: result.insertId, trabajo_id, docente_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
