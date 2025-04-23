// controllers/indexacionRevistaController.js
const db = require('../config/db'); // Tu controlador de base de datos (DBController)

const getIndexacionByTrabajo = async (req, res) => {
    const { id_trabajo } = req.params;
    try {
        const [result] = await db.query(
            'SELECT ir.id, ir.name, ir.value, ir.porcentaje FROM indexacion_revista ir JOIN trabajo_titulacion ti ON ir.id = ti.indexacion_id WHERE ti.id = ?',
            [id_trabajo]
        );
        console.log("result");
        console.log(result);
        res.json(result);
    } catch (error) {
        console.error('Error al obtener la indexación:', error);
        res.status(500).json({ error: 'Error al obtener la indexación de la revista.' });
    }
};

const asignarIndexacion = async (req, res) => {
    const { id_trabajo, id_revista } = req.body;

    // 'INSERT INTO trabajo_titulacion (id, id_revista) VALUES (?, ?)',
    try {
        await db.query(
            'UPDATE trabajo_titulacion SET indexacion_id = ? WHERE id = ?',
            [id_revista, id_trabajo]
        );

        res.status(201).json({ message: 'Indexación asignada correctamente.' });
    } catch (error) {
        console.error('Error al asignar indexación:', error);
        res.status(500).json({ error: 'No se pudo asignar la indexación.' });
    }
};

module.exports = {
    getIndexacionByTrabajo,
    asignarIndexacion,
};
