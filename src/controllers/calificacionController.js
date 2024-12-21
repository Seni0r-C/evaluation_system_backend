// calificacionController.js
const db = require('../config/db'); // Importa la conexión a tu base de datos

// Tipo Evaluacion
exports.createTipoEvaluacion = async (req, res) => {
    const { nombre } = req.body;
    try {
        const result = await db.query('INSERT INTO tipo_evaluacion (nombre) VALUES (?)', [nombre]);
        res.status(201).json({ id: result.insertId, nombre });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTiposEvaluacion = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tipo_evaluacion');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTipoEvaluacionById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM tipo_evaluacion WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Tipo de evaluación no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTipoEvaluacion = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const result = await db.query('UPDATE tipo_evaluacion SET nombre = ? WHERE id = ?', [nombre, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Tipo de evaluación no encontrado' });
        res.json({ id, nombre });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTipoEvaluacion = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM tipo_evaluacion WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Tipo de evaluación no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Rubrica
exports.createRubrica = async (req, res) => {
    const { nombre, tipo_evaluacion_id } = req.body;
    try {
        const result = await db.query('INSERT INTO rubrica (nombre, tipo_evaluacion_id) VALUES (?, ?)', [nombre, tipo_evaluacion_id]);
        res.status(201).json({ id: result.insertId, nombre, tipo_evaluacion_id });
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

exports.getRubricaById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM rubrica WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Rubrica no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRubrica = async (req, res) => {
    const { id } = req.params;
    const { nombre, tipo_evaluacion_id } = req.body;
    try {
        const result = await db.query('UPDATE rubrica SET nombre = ?, tipo_evaluacion_id = ? WHERE id = ?', [nombre, tipo_evaluacion_id, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Rubrica no encontrado' });
        res.json({ id, nombre, tipo_evaluacion_id });
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


// Rubrica Nivel
exports.createRubricaNivel = async (req, res) => {
    const { rubrica_id, nombre, valor, nivel_id } = req.body;
    try {
        const result = await db.query('INSERT INTO rubrica_nivel (rubrica_id, nombre, valor, nivel_id) VALUES (?, ?, ?, ?)', [rubrica_id, nombre, valor, nivel_id]);
        res.status(201).json({ id: result.insertId, rubrica_id, nombre, valor, nivel_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRubricaNiveles = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM rubrica_nivel');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRubricaNivelById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM rubrica_nivel WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Rubrica Nivel no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRubricaNivel = async (req, res) => {
    const { id } = req.params;
    const { rubrica_id, nombre, valor, nivel_id } = req.body;
    try {
        const result = await db.query('UPDATE rubrica_nivel SET rubrica_id = ?, nombre = ?, valor = ?, nivel_id = ? WHERE id = ?', [rubrica_id, nombre, valor, nivel_id, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Rubrica Nivel no encontrado' });
        res.json({ id, rubrica_id, nombre, valor, nivel_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRubricaNivel = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM rubrica_nivel WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Rubrica Nivel no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Rubrica Evaluacion
exports.createRubricaEvaluacion = async (req, res) => {
    const { rubrica_id, nombre, valor, evaluacion_id } = req.body;
    try {
        const result = await db.query('INSERT INTO rubrica_evaluacion (rubrica_id, nombre, valor, evaluacion_id) VALUES (?, ?, ?, ?)', [rubrica_id, nombre, valor, evaluacion_id]);
        res.status(201).json({ id: result.insertId, rubrica_id, nombre, valor, evaluacion_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
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

exports.updateRubricaEvaluacion = async (req, res) => {
    const { id } = req.params;
    const { rubrica_id, nombre, valor, evaluacion_id } = req.body;
    try {
        const result = await db.query('UPDATE rubrica_evaluacion SET rubrica_id = ?, nombre = ?, valor = ?, evaluacion_id = ? WHERE id = ?', [rubrica_id, nombre, valor, evaluacion_id, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Rubrica Evaluacion no encontrado' });
        res.json({ id, rubrica_id, nombre, valor, evaluacion_id });
    } catch (error) {
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