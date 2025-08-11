const db = require('../config/db');
const axios = require('axios');
const { UTM_API_KEY } = require('../config/env');

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
            'X-Api-Key': UTM_API_KEY
        };

        const response = await axios.post(apiUrl, body, {
            headers,
            httpsAgent: agent
        });

        if (response.data.state !== 'success') {
            let mensajeUsuario;
            // Analizar el estado devuelto por la API externa
            if (response.data.error && response.data.error.includes("accesos fallidos")) {
                mensajeUsuario = "Se detectaron varios intentos de acceso fallidos en tu cuenta. Por favor, cambia tu contraseña. Si eres estudiante, solicita un reinicio de clave en la secretaría de tu escuela.";
            } else {
                mensajeUsuario = "Error al autenticar el usuario. Por favor, verifica tus credenciales e intenta nuevamente.";
            }

            // Devolver un mensaje claro al usuario
            return res.status(400).json({ exito: false, mensaje: mensajeUsuario });
        }

        const apiData = response.data.value;

        // Verificar si el usuario pertenece a la facultad de CIENCIAS INFORMÁTICAS
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
