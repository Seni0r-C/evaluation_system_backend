const db = require('../config/db');

exports.getRoles = async (req, res) => {
    try {
        const [roles] = await db.query("SELECT * FROM sistema_rol");
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las rutas', details: error });
    }
};

