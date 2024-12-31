const db = require('../config/db');

// Obtener todas las carreras
exports.getCarreras = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM carrera');
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
exports.createCarrera = (req, res) => {
    const { nombre, id_facultad } = req.body;
    const query = 'INSERT INTO sistema_carrera (nombre, id_facultad) VALUES (?, ?)';
    const [results] = db.query(query, [nombre, id_facultad]);
    res.status(201).json({
        exito: true,
        mensaje: 'Carrera creada',
        id: results.insertId,
    });
};

// Actualizar una carrera
exports.updateCarrera = (req, res) => {
    const { id } = req.params;
    const { nombre, id_facultad } = req.body;
    const query = 'UPDATE sistema_carrera SET nombre = ?, id_facultad = ? WHERE id = ?';
    const [results] = db.query(query, [nombre, id_facultad, id]);

    res.status(200).json({
        exito: true,
        mensaje: 'Carrera actualizada',
    });
};

// Eliminar una carrera
exports.deleteCarrera = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM sistema_carrera WHERE id = ?';
    const [results] = db.query(query, [id]);
    if (results.affectedRows === 0) {
        return res.status(404).json({ exito: false, mensaje: 'Carrera no encontrada' });
    }
    res.status(200).json({
        exito: true,
        mensaje: 'Carrera eliminada',
    });
};