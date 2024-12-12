const db = require('../config/db');

// Crear un nuevo trabajo de titulación
exports.crearTrabajo = async (req, res) => {
    const { carrera_id, modalidad_id, tutor_id, cotutor_id, titulo, link_archivo } = req.body;
    try {
        const [modalidad] = await db.execute(
            'SELECT max_participantes FROM modalidad_titulacion WHERE id = ?',
            [modalidad_id]
        );
        if (!modalidad.length) {
            return res.status(400).json({ error: 'Modalidad no encontrada' });
        }
        const [result] = await db.execute(
            `INSERT INTO trabajo_titulacion 
            (carrera_id, modalidad_id, tutor_id, cotutor_id, titulo, link_archivo) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [carrera_id, modalidad_id, tutor_id, cotutor_id || null, titulo, link_archivo]
        );
        res.status(201).json({ id: result.insertId, titulo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Listar todos los trabajos de titulación
exports.listarTrabajos = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT tt.*, c.nombre AS carrera, mt.nombre AS modalidad
            FROM trabajo_titulacion tt
            JOIN carrera c ON tt.carrera_id = c.id
            JOIN modalidad_titulacion mt ON tt.modalidad_id = mt.id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un trabajo de titulación por su ID
exports.obtenerTrabajo = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute(`
            SELECT tt.*, c.nombre AS carrera, mt.nombre AS modalidad
            FROM trabajo_titulacion tt
            JOIN carrera c ON tt.carrera_id = c.id
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
