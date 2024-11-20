const db = require('../config/db');

// Obtener todas las carreras
const getCarreras = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM carrera');
        res.status(200).json({
            exito: true,
            mensaje: 'Carreras obtenidas',
            datos: results,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Crear una nueva carrera
const createCarrera = (req, res) => {
    const { nombre, id_facultad } = req.body;
    const query = 'INSERT INTO carrera (nombre, id_facultad) VALUES (?, ?)';
    const results = db.query(query, [nombre, id_facultad]);
    res.status(201).json({
        exito: true,
        mensaje: 'Carrera creada',
        id: results.insertId,
    });
};

// Actualizar una carrera
const updateCarrera = (req, res) => {
    const { id } = req.params;
    const { nombre, id_facultad } = req.body;
    const query = 'UPDATE carrera SET nombre = ?, id_facultad = ? WHERE id = ?';
    const results = db.query(query, [nombre, id_facultad, id]);
    res.status(200).json({
        exito: true,
        mensaje: 'Carrera actualizada',
    });
};

// Eliminar una carrera
const deleteCarrera = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM carrera WHERE id = ?';
    const results = db.query(query, [id]);
    res.status(200).json({
        exito: true,
        mensaje: 'Carrera eliminada',
    });
};

module.exports = { getCarreras, createCarrera, updateCarrera, deleteCarrera };
