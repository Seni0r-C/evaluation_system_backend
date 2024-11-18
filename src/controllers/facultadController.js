const db = require('../config/db');

// Obtener todas las carreras
exports.getFacultades = async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM facultad');
        res.status(200).json({
            exito: true,
            mensaje: 'Facultades obtenidas',
            datos: results[0],
        });
    } catch (error) {
        res.status(500).json({ exito: false, mensaje: 'Error al obtener las facultades', error: error.message });
    }
};

// Crear una nueva carrera
exports.createFacultad = (req, res) => {
    const { nombre, id_facultad } = req.body;
    const query = 'INSERT INTO carrera (nombre, id_facultad) VALUES (?, ?)';
    const results = db.query(query, [nombre, id_facultad]);
    res.status(201).json({
        exito: true,
        mensaje: 'Facultad creada',
        id: results[0].insertId,
    });
};

// Actualizar una carrera
exports.updateFacultad = (req, res) => {
    const { id } = req.params;
    const { nombre, id_facultad } = req.body;
    const query = 'UPDATE facultad SET nombre = ?, WHERE id = ?';
    db.query(query, [nombre, id_facultad, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Carrera no encontrada' });
        }
        res.status(200).json({ id, nombre, id_facultad });
    });
};

// Eliminar una carrera
exports.deleteFacultad = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM carrera WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Carrera no encontrada' });
        }
        res.status(200).json({ message: 'Carrera eliminada' });
    });
};


