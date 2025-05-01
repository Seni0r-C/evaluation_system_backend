const db = require('../config/db');// Importar conexión a la base de datos


/**
 * Verifica que el usuario autenticado tenga al menos uno de los roles
 * especificados en `requiredRoles`. Si no tiene acceso, devuelve un
 * 403 con un mensaje de "Acceso denegado: rol no autorizado". Si
 * hay un error al consultar la base de datos, devuelve un 500 con un
 * mensaje de "Error interno del servidor". De lo contrario, permite
 * que el flujo contin e con el siguiente middleware.
 *
 * @param {number[]} requiredRoles Arreglo de IDs de roles
 * @returns {import('express').RequestHandler} Middleware que verifica
 *          los roles del usuario autenticado
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