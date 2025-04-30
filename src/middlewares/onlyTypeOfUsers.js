const db = require('../config/db');// Importar conexión a la base de datos

/**
 * Middleware para verificar si el usuario tiene los roles requeridos.
 * @param {Array<number>} requiredRoles - Array de IDs de roles requeridos.
 */
function verifyRoles(requiredRoles) {
    return async (req, res, next) => {
        try {
            // Obtener el ID del usuario desde el token (asumimos que `auth` ya lo hizo)
            const userId = req.user?.userId; // `req.user` debe ser configurado por el middleware `auth`
            if (!userId) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }

            // Consultar la base de datos para verificar los roles del usuario
            const [rows] = await db.query(
                `SELECT id_rol FROM usuario_rol WHERE id_usuario = ? AND id_rol IN (?)`,
                [userId, requiredRoles]
            );

            // Verificar si el usuario tiene al menos uno de los roles requeridos
            if (rows.length === 0) {
                return res.status(403).json({ message: 'Acceso denegado: rol no autorizado' });
            }

            // El usuario tiene un rol permitido, continuar con el siguiente middleware
            next();
        } catch (error) {
            console.error('Error al verificar roles:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    };
}

module.exports = verifyRoles;