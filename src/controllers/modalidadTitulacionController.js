
const db = require('./db'); // Configuración de conexión a la base de datos

// Crear una nueva modalidad de titulación
exports.crearModalidad = async (req, res) => {
    const { nombre, max_participantes } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO modalidad_titulacion (nombre, max_participantes) VALUES (?, ?)',
            [nombre, max_participantes]
        );
        res.status(201).json({ id: result.insertId, nombre, max_participantes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Listar todas las modalidades de titulación
exports.listarModalidades = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM modalidad_titulacion');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una modalidad específica por su ID
exports.obtenerModalidad = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute('SELECT * FROM modalidad_titulacion WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Modalidad no encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar una modalidad de titulación
exports.actualizarModalidad = async (req, res) => {
    const { id } = req.params;
    const { nombre, max_participantes } = req.body;
    try {
        const [result] = await db.execute(
            'UPDATE modalidad_titulacion SET nombre = ?, max_participantes = ? WHERE id = ?',
            [nombre, max_participantes, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Modalidad no encontrada' });
        }
        res.json({ id, nombre, max_participantes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar una modalidad de titulación
exports.eliminarModalidad = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute('DELETE FROM modalidad_titulacion WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Modalidad no encontrada' });
        }
        res.json({ message: 'Modalidad eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Asociar una modalidad de titulación a una carrera
exports.asociarModalidadCarrera = async (req, res) => {
    const { id_carrera, id_modalidad_titulacion } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO modalidad_titulacion_carrera (id_carrera, id_modalidad_titulacion) VALUES (?, ?)',
            [id_carrera, id_modalidad_titulacion]
        );
        res.status(201).json({ id: result.insertId, id_carrera, id_modalidad_titulacion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Desasociar una modalidad de titulación de una carrera
exports.desasociarModalidadCarrera = async (req, res) => {
    const { id_carrera, id_modalidad_titulacion } = req.body;
    try {
        const [result] = await db.execute(
            'DELETE FROM modalidad_titulacion_carrera WHERE id_carrera = ? AND id_modalidad_titulacion = ?',
            [id_carrera, id_modalidad_titulacion]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Asociación no encontrada' });
        }
        res.json({ message: 'Asociación eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Listar modalidades de titulación por carrera
exports.listarModalidadesPorCarrera = async (req, res) => {
    const { id_carrera } = req.params;
    try {
        const [rows] = await db.execute(
            `SELECT mt.* FROM modalidad_titulacion mt
            INNER JOIN modalidad_titulacion_carrera mtc ON mt.id = mtc.id_modalidad_titulacion
            WHERE mtc.id_carrera = ?`,
            [id_carrera]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};