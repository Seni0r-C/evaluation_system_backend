const db = require('../config/db');

// Obtener todas las carreras
exports.getCarreras = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM sistema_carrera');
        res.status(200).json({
            exito: true,
            mensaje: 'Carreras obtenidas',
            datos: results,
        });
    } catch (error) {
        res.status(500).json({ exito: false, mensaje: 'Error al obtener las carreras', error: error.message });
    }
};

exports.getCarreraById = async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await db.query('SELECT * FROM sistema_carrera WHERE id = ?', [id]);
        res.status(200).json({
            exito: true,
            mensaje: 'Carrera obtenida',
            datos: results,
        });
    } catch (error) {
        res.status(500).json({ exito: false, mensaje: 'Error al obtener la carrera', error: error.message });
    }
};

// Crear una nueva carrera
exports.createCarrera = async (req, res) => {
    const { nombre } = req.body;
    const query = 'INSERT INTO sistema_carrera (nombre) VALUES (?)';
    const [results] = await db.query(query, [nombre]);
    res.status(201).json({
        exito: true,
        mensaje: 'Carrera creada',
        id: results.insertId,
    });
};

// Actualizar una carrera
exports.updateCarrera = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const query = 'UPDATE sistema_carrera SET nombre = ? WHERE id = ?';
    const [results] = await db.query(query, [nombre, id]);

    if (results.affectedRows === 0) {
        return res.status(404).json({ exito: false, mensaje: 'Carrera no encontrada' });
    }

    res.status(200).json({
        exito: true,
        mensaje: 'Carrera actualizada',
    });
};

// Eliminar una carrera
exports.deleteCarrera = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM sistema_carrera WHERE id = ?';
    try {
        const [results] = await db.query(query, [id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Carrera no encontrada' });
        }
        res.status(200).json({
            exito: true,
            mensaje: 'Carrera eliminada',
        });
    } catch (error) {
        res.status(500).json({ exito: false, mensaje: 'Error al eliminar la carrera', error: error.message });
    }
};