const db = require('../config/db');
const { formatDateSelector } = require('../utils/dateUtility.js')
const { GetByIdTrabajoService } = require('../services/trabajoTitulacionService.js');

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
            'SELECT max_participantes FROM sistema_modalidad_titulacion WHERE id = ?',
            [modalidad_id]
        );

        if (!modalidad.length) {
            return res.status(400).json({ error: 'Modalidad no encontrada' });
        }

        // Crear el nuevo trabajo de titulación
        const [result] = await db.execute(
            `INSERT INTO trabajo_titulacion 
            (carrera_id, modalidad_id, tutor_id, cotutor_id, titulo, link_anteproyecto, link_final) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [carrera_id, modalidad_id, tutor_id, cotutor_id || null, titulo, link_archivo, '']
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

        if (Array.isArray(estado) && estado.length > 0) {
            // Generar marcadores de posición dinámicos
            const placeholders = estado.map(() => '?').join(', ');
            whereClauses.push(`tte.nombre IN (${placeholders})`);
            queryParams.push(...estado);  // Expandir el array de estados como valores individuales
        } else if (estado) {
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
            JOIN sistema_modalidad_titulacion mt ON tt.modalidad_id = mt.id
        `;
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


const listThesisGradesByIdDocentStatement = () => {
    return `
       SELECT     
		    tt.id AS id_trabajo		    
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
		    trabajo_titulacion tt ON re.trabajo_id = tt.id
		WHERE docente.id = ?
        `;
}

// Listar todos los trabajos de titulación para el tribunal
exports.listarTrabajosForTribunal = async (req, res) => {
    try {
        const { user } = req.query;
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

        if (Array.isArray(estado) && estado.length > 0) {
            // Generar marcadores de posición dinámicos
            const placeholders = estado.map(() => '?').join(', ');
            whereClauses.push(`tte.nombre IN (${placeholders})`);
            queryParams.push(...estado);  // Expandir el array de estados como valores individuales
        } else if (estado) {
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

        if (user?.id) {
            whereClauses.push('ttb.docente_id = ?');
            queryParams.push(user.id);
            whereClauses.push(`tt.id NOT IN (${listThesisGradesByIdDocentStatement()})`);
            queryParams.push(user.id);
        }
        // Unir todas las cláusulas WHERE si existen
        const whereQuery = whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : '';
        const innerJoins = `
            JOIN sistema_carrera c ON tt.carrera_id = c.id
            JOIN trabajo_estado tte ON tt.estado_id = tte.id
            JOIN sistema_modalidad_titulacion mt ON tt.modalidad_id = mt.id
            JOIN trabajo_tribunal ttb ON tt.id = ttb.trabajo_id
        `;

        // Consulta para obtener los trabajos de titulación con filtros y paginación
        const [rows] = await db.execute(`
            SELECT tt.*, tte.nombre AS estado, c.nombre AS carrera, mt.nombre AS modalidad
            FROM trabajo_titulacion tt
            ${innerJoins}
            ${whereQuery}
            ORDER BY tt.titulo
            LIMIT ? OFFSET ?
        `, [...queryParams, limitNumber, offset]);

        // Consulta para contar el total de trabajos sin paginación, solo con filtros
        const [totalRows] = await db.execute(`
            SELECT COUNT(*) AS total
            FROM trabajo_titulacion tt
            ${innerJoins}
            ${whereQuery}
        `, queryParams);

        // console.log("Total de trabajos: ", totalRows[0].total);
        // console.log(rows);
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
        const rows = await GetByIdTrabajoService(id);
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
    const { link_final } = req.body;
    try {
        const [result] = await db.execute(`
            UPDATE trabajo_titulacion 
            SET link_final = ?, estado_id = 2
            WHERE id = ?`,
            [link_final, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Trabajo no encontrado' });
        }
        res.json({ id, link_final });
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

exports.getQuienPreside = async () => {
    const yearActual = new Date().getFullYear();
    const [rows] = await db.query("SELECT * FROM acta WHERE year = ?", [yearActual]);
    return rows;
}

exports.setQuienPreside = async (quien_preside_id, trabajo_id) => {
    // console.log("quien_preside_id");
    // console.log(quien_preside_id);
    quien_preside_id = quien_preside_id.id;
    const rows = await this.getQuienPreside();
    const yearActual = new Date().getFullYear();
    const acta = rows.length > 0 ? rows[0] : null;
    if (!acta) {
        await db.query("INSERT INTO acta (year, num_year_count, trabajo_id, vicedecano_id) VALUES (?, ?, ?, ?)",
            [yearActual, 0, trabajo_id, quien_preside_id]);
        return;
    }
    await db.query("UPDATE acta SET vicedecano_id = ? WHERE year = ?", [quien_preside_id, yearActual]);
}

let internalInvoke = false;

// Asignar Tribunal (Verifica si ya existen docentes asignados)
exports.asignarTribunal = async (req, res) => {
    const { trabajo_id, docente_ids, fecha_defensa, quien_preside_id } = req.body;
    this.setQuienPreside(quien_preside_id, trabajo_id);
    try {
        if (!trabajo_id) {
            return res.status(400).json({
                typeMsg: 'error',
                message: 'Error en el servidor al asignar tribunal.',
                error: 'El trabajo_id es obligatorio.'
            });
        }

        if (!fecha_defensa) {
            return res.status(400).json({
                typeMsg: 'error',
                message: 'Error en el servidor al asignar tribunal.',
                error: 'La fecha de defensa es obligatoria.'
            });
        }

        if (!Array.isArray(docente_ids) || docente_ids.length === 0) {
            return res.status(400).json({
                typeMsg: 'error',
                message: 'Error en el servidor al asignar tribunal.',
                error: 'Debe proporcionar al menos un docente válido.'
            });
        }

        // Verificar si ya hay docentes asignados
        const [existingRows] = await db.execute(
            `SELECT docente_id FROM trabajo_tribunal WHERE trabajo_id = ?`,
            [trabajo_id]
        );

        const existingDocenteIds = existingRows.map(row => row.docente_id);

        if (existingDocenteIds.length > 0) {
            return res.status(200).json({
                typeMsg: 'warning',
                message: 'Ya existen docentes asignados a este trabajo.',
                data: existingDocenteIds
            });
        }

        // Si no hay docentes previos, proceder con la asignación
        internalInvoke = true;
        const result = await module.exports.reasignarTribunal(req, res);
        internalInvoke = false;
        return result;

    } catch (error) {
        console.error('Error al asignar tribunal:', error);
        res.status(500).json({
            typeMsg: 'error',
            message: 'Error interno del servidor al asignar tribunal.',
            error: error.message
        });
    }
};

// Reasignar Tribunal (Inserta solo docentes no asignados previamente)
exports.reasignarTribunal = async (req, res) => {
    const { trabajo_id, docente_ids, fecha_defensa, quien_preside_id } = req.body;
    if (!internalInvoke) {
        this.setQuienPreside(quien_preside_id, trabajo_id);
    }
    try {
        if (!trabajo_id) {
            return res.status(400).json({
                typeMsg: 'error',
                message: 'Error al reasignar tribunal.',
                error: 'El trabajo_id es obligatorio.'
            });
        }

        if (!Array.isArray(docente_ids) || docente_ids.length === 0) {
            return res.status(400).json({
                typeMsg: 'warning',
                message: 'Debe proporcionar al menos un docente válido.',
            });
        }

        if (!fecha_defensa) {
            return res.status(400).json({
                typeMsg: 'error',
                message: 'Error al reasignar tribunal.',
                error: 'La fecha de defensa es obligatoria.'
            });
        }

        // Validar y formatear antes de la actualización
        const formattedFechaDefensa = formatDateSelector(fecha_defensa);
        console.log("---------- formattedFechaDefensa");
        console.log(formattedFechaDefensa);
        if (!formattedFechaDefensa) {
            return res.json({
                typeMsg: "error",
                message: "El formato de la fecha proporcionada es incorrecto.",
            });
        }
        if (formattedFechaDefensa) {
            // Actualizar la fecha de defensa en la tabla trabajo_titulacion
            await db.execute(
                `UPDATE trabajo_titulacion 
                         SET fecha_defensa = ?,
                         estado_id = ?
                         WHERE id = ?`,
                //  Estado de trabajo 3: "CON TRIBUNAL"
                [fecha_defensa, 3, trabajo_id]
            );
        }
        await db.execute(
            `UPDATE trabajo_titulacion 
                     SET estado_id = ?
                     WHERE id = ?`,
            //  3: "CON TRIBUNAL"
            [3, trabajo_id]
        );
        // Obtener los docentes actualmente asignados al trabajo
        const [existingRows] = await db.execute(
            `SELECT docente_id, tribunal_rol_id FROM trabajo_tribunal WHERE trabajo_id = ?`,
            [trabajo_id]
        );
        const existingDocenteIds = existingRows.map(row => ({ docente_id: row.docente_id, tribunal_rol_id: row.tribunal_rol_id }));

        // Obtener los ids de la solicitud junto con tribunal_rol_id
        const requestedDocenteIds = docente_ids.map((docente, index) => ({
            docente_id: docente?.id,
            tribunal_rol_id: index + 2, // tribunal_rol_id comienza desde 2
        }));

        // Verificar si se debe realizar un reemplazo completo
        const idsAreDifferent = requestedDocenteIds.some(
            req => !existingDocenteIds.some(
                existing => existing.docente_id === req.docente_id && existing.tribunal_rol_id === req.tribunal_rol_id
            )
        );
        const sameLength = requestedDocenteIds.length === existingDocenteIds.length;

        if (idsAreDifferent || !sameLength) {
            // Reemplazo completo: eliminar y volver a insertar
            await db.execute(`DELETE FROM trabajo_tribunal WHERE trabajo_id = ?`, [trabajo_id]);

            // Preparar los valores para la inserción
            const placeholders = requestedDocenteIds.map(() => '(?, ?, ?)').join(', ');
            const flattenedValues = requestedDocenteIds
                .map(({ docente_id, tribunal_rol_id }) => [trabajo_id, docente_id, tribunal_rol_id])
                .flat();

            const query = `
                INSERT INTO trabajo_tribunal (trabajo_id, docente_id, tribunal_rol_id) 
                VALUES ${placeholders}`;

            const [result] = await db.execute(query, flattenedValues);

            return res.status(200).json({
                typeMsg: 'success',
                message: 'Los docentes han sido reemplazados correctamente.',
                insertedCount: result.affectedRows
            });
        }
        else {
            // Filtrar e insertar solo los docentes no existentes
            const newValues = requestedDocenteIds
                .filter(docente => docente?.docente_id && docente?.tribunal_rol_id && !existingDocenteIds.some(
                    existing => existing.docente_id === docente.docente_id && existing.tribunal_rol_id === docente.tribunal_rol_id
                ))
                .map((docente) => [trabajo_id, docente.docente_id, docente.tribunal_rol_id]);

            if (newValues.length > 0) {
                const placeholders = newValues.map(() => '(?, ?, ?)').join(', ');
                const flattenedValues = newValues.flat();

                const query = `
                    INSERT INTO trabajo_tribunal (trabajo_id, docente_id, tribunal_rol_id) 
                    VALUES ${placeholders}`;

                const [result] = await db.execute(query, flattenedValues);

                return res.status(200).json({
                    typeMsg: 'success',
                    message: 'Se han actualizado los miembros del tribunal.',
                    insertedCount: result.affectedRows
                });
            }

            // Ningún cambio realizado
            return res.status(200).json({
                typeMsg: 'success',
                message: 'Los docentes ya estaban correctamente asignados y la fecha ha sido actualizada.'
            });
        }

    } catch (error) {
        console.error('Error al reasignar tribunal:', error);
        res.status(500).json({
            typeMsg: 'error',
            message: 'Error interno del servidor.',
            error: error.message
        });
    }
};

exports.obtenerTribunal = async (req, res) => {
    const { id } = req.params;
    const trabajo_id = id;
    try {
        // Validar la entrada
        if (!trabajo_id) {
            return res.status(400).json({
                typeMsg: 'error',
                message: 'Error en el servidor al obtener datos del tribunal.',
                error: 'El trabajo_id es obligatorio.'
            });
        }

        // Consulta para obtener los docentes asociados al trabajo con información de la tabla usuario
        const query = `
            SELECT u.id, u.usuario, u.id_personal, u.nombre
            FROM trabajo_tribunal tt
            JOIN usuario u ON tt.docente_id = u.id
            WHERE tt.trabajo_id = ?;
        `;

        const [results] = await db.execute(query, [trabajo_id]);

        const rows = await this.getQuienPreside();
        const hasQuienPreside = rows.length > 0 ? rows[0] : null;
        if (hasQuienPreside) {
            const quienPresideId = hasQuienPreside.vicedecano_id;
            const [[quienPresideRow]] = await db.execute("SELECT * FROM usuario WHERE id = ?", [quienPresideId]);
            results.unshift(quienPresideRow);
        }else {
            results.unshift(null);
        }
        // console.log("results (members)");
        // console.log(results);
        // console.log("hasQuienPreside");
        // console.log(hasQuienPreside);
        // console.log("rows");
        // console.log(rows);
        // Validar si no existen docentes asociados
        if (results.length === 0) {
            return res.status(200).json({
                typeMsg: 'info',
                message: 'No se encontraron docentes asociados a este trabajo.',
                data: []
            });
        }

        // Respuesta exitosa con la lista de docentes
        res.status(200).json({
            message: 'Docentes obtenidos correctamente.',
            data: results
        });

    } catch (error) {
        console.error('Error al obtener el tribunal:', error);
        res.status(500).json({
            typeMsg: 'error',
            message: 'Error interno del servidor.',
            error: 'Error interno del servidor.'
        });
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
