const db = require('../config/db');
const axios = require('axios');

/**
 * Autentica al usuario con un servicio externo y retorna los datos.
 * @param {Object} body - Cuerpo de la solicitud con usuario y clave.
 * @param {Object} agent - Agente HTTPS para realizar peticiones externas.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<Object>} - Datos del usuario autenticado.
 * @throws {Error} - Si la autenticación falla.
 */
exports.utmAuth = async (body, agent, res) => {
    try {
        // Hace la petición al endpoint externo
        const apiUrl = "https://app.utm.edu.ec/becas/api/publico/IniciaSesion";

        const headers = {
            'Content-Type': 'application/json',
            'X-Api-Key': '3ecbcb4e62a00d2bc58080218a4376f24a8079e1'
        };

        const response = await axios.post(apiUrl, body, {
            headers,
            httpsAgent: agent
        });

        if (response.data.state !== 'success') {
            return res.status(400).json({ exito: false, mensaje: 'Error en la autenticación externa. ' + response.data.error });
        }

        const apiData = response.data.value;

        // Inserta las carreras asociadas si no existen
        if (apiData.datos_estudio) {
            const datos = JSON.parse(apiData.datos_estudio);
            let isCienciasInformticas = false;
            for (const carrera of datos) {
                const facultad = carrera.facultad;
                if (facultad.includes('CIENCIAS INFORMÁTICAS')) {
                    isCienciasInformticas = true;
                    break;
                }
            }
            if (!isCienciasInformticas) {
                return res.status(400).json({ exito: false, mensaje: 'Usted no pertenece a la carrera CIENCIAS INFORMÁTICAS' });
            }
        }
        return await apiData;
    } catch (error) {
        return res.status(500).json({ exito: false, mensaje: 'Error al autenticar el usuario' });
    }
}

// Función para obtener o insertar un rol
exports.getOrInsertRol = async (tipoUsuario) => {
    const selectRolSql = "SELECT id FROM sistema_rol WHERE nombre = ?";
    const [rol] = await db.query(selectRolSql, [tipoUsuario]);

    if (rol.length > 0) {
        return rol[0].id;
    }

    const insertRolSql = "INSERT INTO sistema_rol (nombre) VALUES (?)";
    const result = await db.query(insertRolSql, [tipoUsuario]);
    return result[0].insertId;
}

// Función para insertar carrera si no existe
exports.insertCarreraIfNotExists = async (nombreCarrera) => {
    const selectCarreraSql = "SELECT id FROM sistema_carrera WHERE nombre = ?";
    const [carrera] = await db.query(selectCarreraSql, [nombreCarrera]);

    if (carrera.length === 0) {
        const insertCarreraSql = "INSERT INTO sistema_carrera (nombre) VALUES (?)";
        const [result] = await db.query(insertCarreraSql, [nombreCarrera]);
        return result.insertId;
    }
    return carrera[0].id;
}
