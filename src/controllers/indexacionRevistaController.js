const db = require('../config/db');

const getAllIndexaciones = async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM indexacion_revista');
        res.json(result);
    } catch (error) {
        console.error('Error al obtener indexaciones:', error);
        res.status(500).json({ error: 'No se pudieron obtener las indexaciones.' });
    }
};

const createIndexacion = async (req, res) => {
    const { name, value, porcentaje } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO indexacion_revista(name, value, porcentaje) VALUES (?, ?, ?)',
            [name, value, porcentaje]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No se pudo crear la indexación.' });
        }
        res.json({ message: 'Indexación creada correctamente.' });
    } catch (error) {
        console.error('Error al actualizar indexación:', error);
        res.status(500).json({ error: 'No se pudo actualizar la indexación.' });
    }
};

const updateIndexacion = async (req, res) => {
    const { id } = req.params;
    const { name, value, porcentaje } = req.body;

    try {
        const result = await db.query(
            'UPDATE indexacion_revista SET name = ?, value = ?, porcentaje = ? WHERE id = ?',
            [name, value, porcentaje, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Indexación no encontrada.' });
        }

        res.json({ message: 'Indexación actualizada correctamente.' });
    } catch (error) {
        console.error('Error al actualizar indexación:', error);
        res.status(500).json({ error: 'No se pudo actualizar la indexación.' });
    }
};

const deleteIndexacion = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM indexacion_revista WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Indexación no encontrada.' });
        }

        res.json({ message: 'Indexación eliminada correctamente.' });
    } catch (error) {
        console.error('Error al eliminar indexación:', error);
        res.status(500).json({ error: 'No se pudo eliminar la indexación.' });
    }
};

module.exports = {
    getAllIndexaciones,
    updateIndexacion,
    createIndexacion,
    deleteIndexacion,
};
