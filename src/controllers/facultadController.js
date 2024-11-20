const db = require('../config/db');

// Obtener todas las carreras
exports.getFacultades = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM facultad');
        res.status(200).json({
            exito: true,
            mensaje: 'Facultades obtenidas',
            datos: results,
        });
    } catch (error) {
        res.status(500).json({ exito: false, mensaje: 'Error al obtener las facultades', error: error.message });
    }
};

// Crear una nueva carrera
exports.createFacultad = async (req, res) => {
    const { nombre, id_facultad } = req.body;
    const query = 'INSERT INTO carrera (nombre, id_facultad) VALUES (?, ?)';
    const [results] = await db.query(query, [nombre, id_facultad]);
    res.status(201).json({
        exito: true,
        mensaje: 'Facultad creada',
        id: results.insertId,
    });
};

// Actualizar una carrera
exports.updateFacultad = async (req, res) => {
    const { id } = req.params;
    const { nombre, id_facultad } = req.body;
    const query = 'UPDATE facultad SET nombre = ?, WHERE id = ?';
    const [results] = await db.query(query, [nombre, id_facultad]);
    if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Facultad no encontrada' });
    }
    res.status(200).json({
        exito: true,
        mensaje: 'Facultad actualizada',
    });
};

// Eliminar una carrera
exports.deleteFacultad = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM carrera WHERE id = ?';
    const [results] = await db.query(query, [id]);
    if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Facultad no encontrada' });
    }
    res.status(200).json({
        exito: true,
        mensaje: 'Facultad eliminada',
    });
};


