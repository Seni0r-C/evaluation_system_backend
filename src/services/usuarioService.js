const db = require('../config/db');

// Servicio para obtener el nombre de un usuario
exports.GetNombreUsuarioService = async (usuario_id) => {
    const [rows] = await db.query('SELECT nombre FROM usuario WHERE id = ?', [usuario_id]);
    return rows[0]?.nombre;
}