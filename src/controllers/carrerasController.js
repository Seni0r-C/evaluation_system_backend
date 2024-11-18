const db = require('../config/db');

// Obtener todas las carreras
const getCarreras = async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM carrera');
        res.status(200).json({
            exito: true,
            mensaje: 'Carreras obtenidas',
            datos: results[0],
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

    });
    // db.query(query, [nombre, id_facultad], (err, results) => {
    //     if (err) {
    //         return res.status(500).json({ error: err.message });
    //     }
    //     res.status(201).json({ id: results.insertId, nombre, id_facultad });
    // });
};

// Actualizar una carrera
const updateCarrera = (req, res) => {
    const { id } = req.params;
    const { nombre, id_facultad } = req.body;
    const query = 'UPDATE carrera SET nombre = ?, id_facultad = ? WHERE id = ?';
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
const deleteCarrera = (req, res) => {
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

module.exports = { getCarreras, createCarrera, updateCarrera, deleteCarrera };
