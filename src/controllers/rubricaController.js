const db = require('../config/db');
const rubricaService = require('../services/rubricaService');

exports.obtenerModalidades = async (req, res) => {
    try {
        const modalidades = await rubricaService.getModalidades();
        res.json(modalidades);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obteniendo modalidades' });
    }
};

exports.obtenerTiposEvaluacion = async (req, res) => {
    try {
        const tiposEvaluacion = await rubricaService.getTiposEvaluacion();
        res.json(tiposEvaluacion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obteniendo tipos de evaluación' });
    }
};

exports.obtenerCriteriosRubrica = async (req, res) => {
    const { modalidadId, tipoEvaluacionId } = req.query;

    if (!modalidadId || !tipoEvaluacionId) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    try {
        const criterios = await rubricaService.getCriteriosRubrica(modalidadId, tipoEvaluacionId);
        res.json(criterios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obteniendo criterios de rúbrica' });
    }
};

exports.actualizarCriterioRubrica = async (req, res) => {
    const { id, nombre, puntaje_maximo } = req.body;

    if (!id || !nombre || puntaje_maximo === undefined) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    try {
        const actualizado = await rubricaService.updateCriterioRubrica(id, nombre, puntaje_maximo);
        if (actualizado) {
            res.json({ message: 'Criterio actualizado exitosamente' });
        } else {
            res.status(404).json({ error: 'Criterio no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error actualizando criterio' });
    }
};


// Crear un nuevo criterio de rúbrica
exports.crearCriterioRubrica = async (req, res) => {
    const { nombre, puntaje_maximo, modalidad_id, tipo_evaluacion_id } = req.body;

    if (!nombre || !puntaje_maximo || !modalidad_id || !tipo_evaluacion_id) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    try {
        const [[rubrica]] = await db.execute(
            `SELECT id FROM rubrica WHERE modalidad_id = ? AND tipo_evaluacion_id = ? LIMIT 1`,
            [modalidad_id, tipo_evaluacion_id]
        );
        const rubrica_id = rubrica?.id;
        console.log("crearCriterio Rubrica");
        console.log("rubrica_id");
        console.log(rubrica_id);
        console.log([rubrica_id, nombre, puntaje_maximo]);
        await db.execute(
            `INSERT INTO rubrica_criterio (rubrica_id, nombre, puntaje_maximo) 
             VALUES (?, ?, ?)`,
            [rubrica_id, nombre, puntaje_maximo]
        );
        res.json({ message: "Criterio creado con éxito." });
    } catch (error) {
        console.error("Error al crear criterio de rúbrica:", error);
        res.status(500).json({ message: "Error al crear criterio." });
    }
};


// Eliminar un criterio de rúbrica
exports.eliminarCriterioRubrica = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute(`DELETE FROM rubrica_criterio WHERE id = ?`, [id]);
        res.json({ message: "Criterio eliminado con éxito." });
    } catch (error) {
        console.error("Error al eliminar criterio de rúbrica:", error);
        res.status(500).json({ message: "Error al eliminar criterio." });
    }
};


// Obtener criterios de rúbrica filtrados por modalidad y tipo de evaluación
exports.obtenerCriteriosRubrica2 = async (req, res) => {
    const { modalidad_id, tipo_evaluacion_id } = req.params;
    try {
        const [criterios] = await db.execute(
            `SELECT id AS criterio_id, nombre AS criterio_nombre, puntaje_maximo 
             FROM rubrica_criterios 
             WHERE modalidad_id = ? AND tipo_evaluacion_id = ?`,
            [modalidad_id, tipo_evaluacion_id]
        );
        res.json(criterios);
    } catch (error) {
        console.error("Error al obtener criterios de rúbrica:", error);
        res.status(500).json({ message: "Error al obtener criterios." });
    }
};

// Actualizar un criterio de rúbrica
exports.actualizarCriterioRubrica2 = async (req, res) => {
    const { id } = req.params;
    const { nombre, puntaje_maximo } = req.body;

    if (!nombre || !puntaje_maximo) {
        return res.status(400).json({ message: "Nombre y puntaje máximo son obligatorios." });
    }

    try {
        await db.execute(
            `UPDATE rubrica_criterios SET nombre = ?, puntaje_maximo = ? WHERE id = ?`,
            [nombre, puntaje_maximo, id]
        );
        res.json({ message: "Criterio actualizado con éxito." });
    } catch (error) {
        console.error("Error al actualizar criterio de rúbrica:", error);
        res.status(500).json({ message: "Error al actualizar criterio." });
    }
};

// Obtener tipos de evaluación por modalidad
exports.obtenerTiposEvaluacionPorModalidad = async (req, res) => {
    const { modalidad_id } = req.params;
    try {
        const [tiposEvaluacion] = await db.execute(`
        SELECT te.id,
            te.nombre,
            te_padre.id AS padre_id,
            smt.nombre AS modaliad,
            te.pos_evaluation,
            te.calificacion_global,
            te.modificador,
            te.valor_base
        FROM sistema_tipo_evaluacion te
        JOIN rubrica r ON te.id = r.tipo_evaluacion_id
        LEFT JOIN acta_notas_scheme ans ON te.id = ans.comp_id
        LEFT JOIN sistema_tipo_evaluacion te_padre ON ans.comp_parent_id = te_padre.id
        LEFT JOIN sistema_modalidad_titulacion smt ON smt.id = r.modalidad_id
        WHERE r.modalidad_id = ?
        AND smt.id = ans.trabajo_modalidad_id
        GROUP BY te.id
    `,
            [modalidad_id]
        );
        res.json(tiposEvaluacion);
    } catch (error) {
        console.error("Error al obtener tipos de evaluación:", error);
        res.status(500).json({ message: "Error al obtener tipos de evaluación." });
    }
};
