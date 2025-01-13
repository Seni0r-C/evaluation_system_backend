const db = require('../config/db'); // Suponiendo que tienes un modelo para la base de datos   

exports.getRoles = async (req, res) => {
    try {
        const [roles] = await db.query("SELECT * FROM sistema_rol");
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las rutas', details: error });
    }
};