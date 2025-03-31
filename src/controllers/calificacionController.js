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
		WHERE tt.id = ? 
		GROUP BY docente.id
        `;
}

const isCompleteThesis = async (docent_id, trabajo_id, db) => {
    const [rows] = await db.query(`
                ${getCompleteThesisGradeStatement()}
        `, [trabajo_id]);

    console.log("isCompleteThesis. rows.length");
    console.log(rows.length);
    console.log(rows);
    return rows.length === 3;
}

// Rubrica Evaluacion
// exports.createRubricaEvaluaciones = async (req, res) => {
//     const { calificaciones } = req.body;

//     if (!Array.isArray(calificaciones) || calificaciones.length === 0) {
//         return res.status(400).json({ error: "El array de calificaciones es inválido o está vacío." });
//     }

//     const connection = await db.getConnection(); // Asegúrate de usar un pool de conexiones

//     // console.log("calificaciones");
//     // console.log(calificaciones);

//     try {
//         await connection.beginTransaction();

//         const insertPromises = calificaciones.map(({ trabajo_id, rubrica_id, rubrica_criterio_id, docente_id, estudiante_id, puntaje_obtenido }) => {
//             return connection.query(
//                 'INSERT INTO rubrica_evaluacion (trabajo_id, rubrica_id, rubrica_criterio_id, docente_id, estudiante_id, puntaje_obtenido) VALUES (?, ?, ?, ?, ?, ?)',
//                 [trabajo_id, rubrica_id, rubrica_criterio_id, docente_id, estudiante_id, puntaje_obtenido]
//             );
//         });
//         console.log("const insertPromises = calificaciones.map");
//         // Ejecutar todas las inserciones
//         await Promise.all(insertPromises);
//         console.log("await Promise.all(insertPromises)");

//         const trabajo_id = calificaciones[0].trabajo_id;
//         const docente_id = calificaciones[0].docente_id;
//         console.log("const trabajo_id = c...[0].docente_id;");
//         // Verificar si el trabajo de tesis ha sido calificado por todos los docentes (3)
//         const isCompleteThesisValue = await isCompleteThesis(docente_id, trabajo_id, connection);
//         console.log(`isCompleteThesis(docente_id: ${docente_id}, trabajo_id: ${trabajo_id})`);
//         console.log(isCompleteThesisValue);
//         if (isCompleteThesisValue) {
//             // Cambiar el estado del trabajo a "DEFENDIDO" o sea 4
//             await connection.query(
//                 'UPDATE trabajo_titulacion SET estado_id = 4 WHERE id = ?',
//                 [trabajo_id]
//             );
//         }

//         await connection.commit();

//         res.status(201).json({ message: "Calificaciones guardadas exitosamente." });
//     } catch (error) {
//         await connection.rollback();
//         res.status(500).json({ error: "Error al guardar las calificaciones: " + error.message });
//     } finally {
//         connection.release();
//     }
// };

exports.createRubricaEvaluaciones = async (req, res) => {
    const { calificaciones } = req.body;

    if (!Array.isArray(calificaciones) || calificaciones.length === 0) {
        return res.status(400).json({ error: "El array de calificaciones es inválido o está vacío." });
    }

    const connection = await db.getConnection(); // Asegúrate de usar un pool de conexiones

    try {
        await connection.beginTransaction();

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
                return connection.query(
                    `UPDATE rubrica_evaluacion 
                     SET puntaje_obtenido = ? 
                     WHERE id = ?`,
                    [puntaje_obtenido, existingRecord[0].id]
                );
            } else {
                // Si no existe, insertar una nueva calificación
                return connection.query(
                    `INSERT INTO rubrica_evaluacion 
                     (trabajo_id, rubrica_id, rubrica_criterio_id, docente_id, estudiante_id, puntaje_obtenido) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [trabajo_id, rubrica_id, rubrica_criterio_id, docente_id, estudiante_id, puntaje_obtenido]
                );
            }
        });

        await Promise.all(updateOrInsertPromises);

        const trabajo_id = calificaciones[0].trabajo_id;
        const docente_id = calificaciones[0].docente_id;

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

        res.status(201).json({ message: "Calificaciones guardadas o actualizadas exitosamente." });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: "Error al procesar las calificaciones: " + error.message });
    } finally {
        connection.release();
    }
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
        te.trabajo_id = ? AND re.docente_id = ?
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
        const [rows] = await db.query(getGradesRubricCriterialStatement(), [trabajo_id, docente_id ]);
        console.log(rows);
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

