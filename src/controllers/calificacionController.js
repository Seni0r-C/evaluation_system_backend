// calificacionController.js
const db = require('../config/db'); // Importa la conexión a tu base de datos

// Tipo Evaluacion
exports.createTipoEvaluacion = async (req, res) => {
    const { nombre } = req.body;
    try {
        const result = await db.query('INSERT INTO sistema_tipo_evaluacion (nombre) VALUES (?)', [nombre]);
        res.status(201).json({ id: result.insertId, nombre });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTiposEvaluacion = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM sistema_tipo_evaluacion');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTipoEvaluacionByModalidadId = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`SELECT 
            ste.id AS tipo_evaluacion_id,
            ste.nombre AS tipo_evaluacion_nombre
        FROM 
            rubrica r
        INNER JOIN 
            sistema_tipo_evaluacion ste 
        ON 
            r.tipo_evaluacion_id = ste.id
        WHERE 
            r.modalidad_id = ?;`, [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Tipo de evaluación no encontrado' });
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTipoEvaluacion = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const result = await db.query('UPDATE sistema_tipo_evaluacion SET nombre = ? WHERE id = ?', [nombre, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Tipo de evaluación no encontrado' });
        res.json({ id, nombre });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTipoEvaluacion = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM sistema_tipo_evaluacion WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Tipo de evaluación no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Rubrica
exports.createRubrica = async (req, res) => {
    const { modalidad_id, tipo_evaluacion_id } = req.body;
    try {
        const result = await db.query('INSERT INTO rubrica (modalidad_id, tipo_evaluacion_id) VALUES (?, ?)', [modalidad_id, tipo_evaluacion_id]);
        res.status(201).json({ id: result.insertId, modalidad_id, tipo_evaluacion_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRubricas = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM rubrica');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getRubrica = async (req, res) => {
    const { id_tipo_evaluacion, id_modalidad } = req.query;

    if (!id_tipo_evaluacion && !id_modalidad) {
        const [rows] = await db.query('SELECT * FROM vista_rubricas_detalle');
        return res.json(rows);
    }

    if (!id_tipo_evaluacion || !id_modalidad) {
        return res.status(400).json({ error: 'Los parámetros id_tipo_evaluacion y id_modalidad son obligatorios' });
    }
    try {
        // Obtener la rúbrica principal
        const [rubricaRows] = await db.query(
            'SELECT * FROM rubrica WHERE tipo_evaluacion_id = ? AND modalidad_id = ?',
            [id_tipo_evaluacion, id_modalidad]
        );

        if (rubricaRows.length === 0) {
            return res.status(404).json({ message: 'Rúbrica no encontrada' });
        }

        const rubrica = rubricaRows[0];

        // Obtener los criterios asociados a la rúbrica
        const [criteriosRows] = await db.query(
            'SELECT * FROM rubrica_criterio WHERE rubrica_id = ?',
            [rubrica.id]
        );


        return res.json({
            rubrica,
            criterios: criteriosRows
        });

    } catch (error) {
        console.error('Error al obtener la rúbrica:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.updateRubrica = async (req, res) => {
    const { id } = req.params;
    const { modalidad_id, tipo_evaluacion_id } = req.body;
    try {
        const result = await db.query('UPDATE rubrica SET modalidad_id = ?, tipo_evaluacion_id = ? WHERE id = ?', [modalidad_id, tipo_evaluacion_id, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Rubrica no encontrado' });
        res.json({ id, nombre: modalidad_id, tipo_evaluacion_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRubrica = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM rubrica WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Rubrica no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Rubrica Criterio
exports.createRubricaCriterio = async (req, res) => {
    const { rubrica_id, nombre, valor, criterio_id } = req.body;
    try {
        const result = await db.query('INSERT INTO rubrica_criterio (rubrica_id, nombre, valor, criterio_id) VALUES (?, ?, ?, ?)', [rubrica_id, nombre, valor, criterio_id]);
        res.status(201).json({ id: result.insertId, rubrica_id, nombre, valor, criterio_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRubricaCriterios = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM rubrica_criterio');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRubricaCriterioById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM rubrica_criterio WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Rubrica Criterio no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRubricaCriterio = async (req, res) => {
    const { id } = req.params;
    const { rubrica_id, nombre, valor, criterio_id } = req.body;
    try {
        const result = await db.query('UPDATE rubrica_criterio SET rubrica_id = ?, nombre = ?, valor = ?, criterio_id = ? WHERE id = ?', [rubrica_id, nombre, valor, criterio_id, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Rubrica Criterio no encontrado' });
        res.json({ id, rubrica_id, nombre, valor, criterio_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRubricaCriterio = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM rubrica_criterio WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Rubrica Criterio no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getCompleteThesisGradeStatement = () => {
    return `
        SELECT     
		    docente.id
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
		WHERE tt.id = ? AND te.nombre NOT LIKE "EXAMEN TEORICO"
		GROUP BY docente.id
        `;
}

const isCompleteThesis = async (docent_id, trabajo_id, db) => {
    const [rows] = await db.query(`
                ${getCompleteThesisGradeStatement()}
        `, [trabajo_id]);

    return rows.length === 3;
}

const isThisMiembrotribunalCorrect = async (connection, trabajo_id, docente_id) => {
    const [result] = await connection.query(`
        SELECT
            docente_id
        FROM
            trabajo_tribunal
        WHERE
            trabajo_id = ? AND docente_id = ?
        `, [trabajo_id, docente_id]);
    return result.length !== 0;
}

const createRubricaEvaluacionesService = async (connection, calificaciones, req) => {
    if (!Array.isArray(calificaciones) || calificaciones.length === 0) {
        return { error: "El array de calificaciones es inválido o está vacío.", status: 400 };
    }

    const trabajo_id = calificaciones[0].trabajo_id;
    const docente_id = calificaciones[0].docente_id;

    //verificar si el docente es el mismo que esta enviado la solicitud
    const { userId } = req.user;
    if (userId !== docente_id) {
        return { error: "No puede calificar por otro docente", status: 403 };
    }

    // Verificar si el docente esta asignado para el trabajo
    if (!await isThisMiembrotribunalCorrect(connection, trabajo_id, docente_id)) {
        return { error: "El docente no esta asignado para el trabajo", status: 400 };
    }

    // Verificar si el trabajo de tesis ha sido calificado por todos los docentes (3)
    const isComplete = await isCompleteThesis(docente_id, trabajo_id, connection);

    if (!isComplete) {
        return { error: "El trabajo de tesis no ha sido calificado por todos los docentes", status: 400 };
    }

    const updateOrInsertPromises = calificaciones.map(async ({ trabajo_id, rubrica_id, rubrica_criterio_id, docente_id, estudiante_id, puntaje_obtenido }) => {
        // Verificar si la calificación ya existe
        const [existingRecord] = await connection.query(
            `SELECT id FROM rubrica_evaluacion 
                 WHERE trabajo_id = ? AND rubrica_id = ? AND rubrica_criterio_id = ? 
                 AND docente_id = ? AND estudiante_id = ?`,
            [trabajo_id, rubrica_id, rubrica_criterio_id, docente_id, estudiante_id]
        );

        if (existingRecord.length > 0) {
            // Si ya existe, actualizar el puntaje
            await connection.query(
                `UPDATE rubrica_evaluacion 
                     SET puntaje_obtenido = ? 
                     WHERE id = ?`,
                [puntaje_obtenido, existingRecord[0].id]
            );

            return {error: null};
        } else {
            // Si no existe, insertar una nueva calificación
            await connection.query(
                `INSERT INTO rubrica_evaluacion 
                     (trabajo_id, rubrica_id, rubrica_criterio_id, docente_id, estudiante_id, puntaje_obtenido) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
                [trabajo_id, rubrica_id, rubrica_criterio_id, docente_id, estudiante_id, puntaje_obtenido]
            );

            return {error: null};
        }
    });

    await Promise.all(updateOrInsertPromises);

    // Verificar si el trabajo de tesis ha sido calificado por todos los docentes (3)
    const isCompleteThesisValue = await isCompleteThesis(docente_id, trabajo_id, connection);

    if (isCompleteThesisValue) {
        // Cambiar el estado del trabajo a "DEFENDIDO" o sea 4
        await connection.query(
            'UPDATE trabajo_titulacion SET estado_id = 4 WHERE id = ?',
            [trabajo_id]
        );
    }

    await connection.commit();

}

exports.createRubricaEvaluaciones = async (req, res) => {
    const { calificaciones } = req.body;
    const connection = await db.getConnection(); // Asegúrate de usar un pool de conexiones
    try {
        await connection.beginTransaction();
        const result = await createRubricaEvaluacionesService(connection, calificaciones, req);
        if (result.error) {
            await connection.rollback();
            return res.status(result.status).json({ error: result.error });
        }
        res.status(201).json({ message: "Calificaciones guardadas o actualizadas exitosamente." });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: "Error al procesar las calificaciones: " + error.message });
    } finally {
        connection.release();
    }
};

const geValueOfExamenTeoricoGradeByIdTrabajoStatement = () => {
    return `
    SELECT 
        re.id AS rubrica_evaluacion_id,
        re.trabajo_id,
        re.docente_id,
        re.estudiante_id,
        re.puntaje_obtenido,
        rc.id AS rubrica_criterio_id,
        rc.nombre AS criterio_nombre,
        rc.puntaje_maximo,
        ste.nombre AS tipo_evaluacion
    FROM rubrica_evaluacion re
    JOIN rubrica_criterio rc ON re.rubrica_criterio_id = rc.id
    JOIN rubrica r ON rc.rubrica_id = r.id
    JOIN sistema_tipo_evaluacion ste ON r.tipo_evaluacion_id = ste.id
    WHERE 
        rc.puntaje_maximo = 40
        AND ste.nombre LIKE '%EXAMEN TEORICO%'
        AND re.trabajo_id = ? LIMIT 1
    `;
}

const geValueOfExamenTeoricoGradeByIdTrabajo = async (db, id_trabajo) => {
    const [rows] = await db.query(`
                    ${geValueOfExamenTeoricoGradeByIdTrabajoStatement()}
            `, [id_trabajo]);
    return rows;
}

exports.geValueOfExamenTeoricoGradeByTrabajoIdController = async (req, res) => {
    try {
        const trabajo_id = req.params.trabajo_id;
        const [row] = await geValueOfExamenTeoricoGradeByIdTrabajo(db, trabajo_id);
        console.log("geValueOfExamenTeoricoGradeByTrabajoIdController");
        console.log({ trabajo_id, row });
        res.status(200).json({ grade: row?.puntaje_obtenido ?? null });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getIdsExamenTeoricoGradeStatement = () => {
    return `
    SELECT r.id rubrica_id, rc.id rubrica_criterio_id FROM rubrica_criterio rc 
    INNER JOIN rubrica r ON r.id = rc.rubrica_id  
    INNER JOIN sistema_tipo_evaluacion ste ON ste.id = r.tipo_evaluacion_id
    WHERE puntaje_maximo=40 AND ste.nombre LIKE '%EXAMEN TEORICO%'
    `;
}

const getIdsExamenTeoricoGrade = async (db) => {
    const [rows] = await db.query(`
                    ${getIdsExamenTeoricoGradeStatement()}
            `);
    console.log("getIdsExamenTeoricoGrade");
    console.log(rows);
    return rows;
}

exports.createRubricaEvaluacionExamenTeorico = async (req, res) => {
    const { trabajo_id, docents, students, teoricExamGrade } = req.body;
    const [{ rubrica_id, rubrica_criterio_id }] = await getIdsExamenTeoricoGrade(db);
    const calificaciones = [];

    const connection = await db.getConnection(); // Asegúrate de usar un pool de conexiones

    // Verificar si el miembro del tribunal esta asignado para el trabajo
    if (!await isThisMiembrotribunalCorrect(connection, trabajo_id, docents[0].id)) {
        return res.status(400).json({ error: "El docente no esta asignado para el trabajo" });
    }

    for (const docent of docents) {
        for (const student of students) {
            const calificacion = {
                trabajo_id: trabajo_id,
                rubrica_id: rubrica_id,
                rubrica_criterio_id: rubrica_criterio_id,
                docente_id: docent.id,
                estudiante_id: student.id,
                puntaje_obtenido: teoricExamGrade
            }
            calificaciones.push(calificacion);
        }
    }


    try {
        await connection.beginTransaction();
        const result = await createRubricaEvaluacionesService(connection, calificaciones, req);
        if (result.error) {
            await connection.rollback();
            return res.status(result.status).json({ error: result.error });
        }
        res.status(200).json({ message: "Calificacion de EXAMEN TEORICO guardada exitosamente." });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: "Error al procesar calificacion de EXAMEN TEORICO: " + error.message });
    } finally {
        connection.release();
    }

    console.log({ trabajo_id, docents, students, teoricExamGrade });
};


exports.getRubricaEvaluaciones = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM rubrica_evaluacion');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getRubricaEvaluacionById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM rubrica_evaluacion WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Rubrica Evaluacion no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getGradesRubricCriterialStatement = () => {
    return `
    SELECT 
        re.estudiante_id,
        ste.nombre AS tipo_evaluacion,
        re.rubrica_criterio_id,
        re.puntaje_obtenido
    FROM rubrica_evaluacion re
    JOIN rubrica r ON re.rubrica_id = r.id
    JOIN sistema_tipo_evaluacion ste ON r.tipo_evaluacion_id = ste.id
    JOIN trabajo_estudiante te ON re.estudiante_id = te.estudiante_id
    WHERE 
        re.trabajo_id = ? AND te.trabajo_id = ? AND re.docente_id = ?
    `
}


const transformRubricGradeData = (data) => {
    const result = {};

    data.forEach(({ estudiante_id, tipo_evaluacion, puntaje_obtenido }) => {
        const id = estudiante_id.toString();
        if (!result[id]) result[id] = {};
        if (!result[id][tipo_evaluacion]) result[id][tipo_evaluacion] = {};

        const index = Object.keys(result[id][tipo_evaluacion]).length;
        result[id][tipo_evaluacion][index] = parseInt(puntaje_obtenido, 10);
    });

    return result;
};

exports.getGradesRubricCriterial = async (req, res) => {
    const { trabajo_id, docente_id } = req.query;
    try {
        const [rows] = await db.query(getGradesRubricCriterialStatement(), [trabajo_id, trabajo_id, docente_id]);
        res.json(transformRubricGradeData(rows));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateRubricaEvaluacion = async (req, res) => {
    const { id } = req.params;
    const {
        trabajo_id,          // Id del trabajo
        rubrica_id,          // Id de la rúbrica
        rubrica_criterio_id, // Id del criterio de la rúbrica
        docente_id,          // Id del docente
        estudiante_id,       // Id del estudiante
        puntaje_obtenido     // Puntaje obtenido
    } = req.body;

    try {
        // Consulta para actualizar el registro
        const result = await db.query(
            'UPDATE rubrica_evaluacion SET trabajo_id = ?, rubrica_id = ?, rubrica_criterio_id = ?, docente_id = ?, estudiante_id = ?, puntaje_obtenido = ? WHERE id = ?',
            [trabajo_id, rubrica_id, rubrica_criterio_id, docente_id, estudiante_id, puntaje_obtenido, id]
        );

        // Verificar si se actualizó algún registro
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Rubrica Evaluacion no encontrada' });
        }

        // Responder con los nuevos valores
        res.json({
            id,
            trabajo_id,
            rubrica_id,
            rubrica_criterio_id,
            docente_id,
            estudiante_id,
            puntaje_obtenido
        });
    } catch (error) {
        // En caso de error, responder con el mensaje
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRubricaEvaluacion = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM rubrica_evaluacion WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Rubrica Evaluacion no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getJerarquias = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                ans.id,
                te_hijo.id AS comp_id,
                te_hijo.nombre AS nombre_hijo,
                te_padre.id AS comp_parent_id,
                te_padre.nombre AS nombre_padre,
                smt.id AS trabajo_modalidad_id,
                smt.nombre AS modalidad
            FROM acta_notas_scheme ans
            JOIN sistema_tipo_evaluacion te_hijo ON ans.comp_id = te_hijo.id
            LEFT JOIN sistema_tipo_evaluacion te_padre ON ans.comp_parent_id = te_padre.id
            JOIN sistema_modalidad_titulacion smt ON ans.trabajo_modalidad_id = smt.id;
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createJerarquia = async (req, res) => {
    const { comp_id, comp_parent_id, trabajo_modalidad_id } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO acta_notas_scheme (comp_id, comp_parent_id, trabajo_modalidad_id) VALUES (?, ?, ?)',
            [comp_id, comp_parent_id || null, trabajo_modalidad_id]
        );
        res.status(201).json({ id: result.insertId, comp_id, comp_parent_id, trabajo_modalidad_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateJerarquia = async (req, res) => {
    const { id } = req.params;
    const { comp_id, comp_parent_id, trabajo_modalidad_id } = req.body;
    try {
        await db.query(
            'UPDATE acta_notas_scheme SET comp_id = ?, comp_parent_id = ?, trabajo_modalidad_id = ? WHERE id = ?',
            [comp_id, comp_parent_id || null, trabajo_modalidad_id, id]
        );
        res.json({ id, comp_id, comp_parent_id, trabajo_modalidad_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteJerarquia = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM acta_notas_scheme WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Jerarquía no encontrada' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

