const jwt = require('jsonwebtoken');
const db = require('../config/db');
const axios = require('axios');
const https = require('https');
const { getOrInsertRol, insertCarreraIfNotExists } = require('../services/authService');
const { externalAuth } = require('../utils/constantes');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const agent = new https.Agent({
    rejectUnauthorized: false
});

exports.registerUser = async (req, res) => {
    try {
        const { cedula, usuario, password } = req.body;

        // 1. Validar con servicio externo
        const body = { usuario, clave: password };
        const apiData = await externalAuth(body, res);

        if (apiData.statusCode === 400) {
            return; // La respuesta de error ya fue enviada por externalAuth
        }

        // 2. Verificar si el usuario o la cédula ya existen
        const [existingUser] = await db.query(
            "SELECT * FROM usuario WHERE usuario = ? OR cedula = ?",
            [usuario, cedula]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                exito: false,
                mensaje: 'El usuario o la cédula ya están registrados.'
            });
        }

        // 3. Insertar nuevo usuario
        await db.query("BEGIN");

        const insertUserSql = `
            INSERT INTO usuario (id_personal, nombre, usuario, cedula) 
            VALUES (?, ?, ?, ?)
        `;
        const { nombres, idpersonal, tipo_usuario, datos_estudio } = apiData;
        const [result] = await db.query(insertUserSql, [idpersonal, nombres, usuario, cedula]);
        const newUserId = result.insertId;

        // 4. Asignar rol
        const rolId = await getOrInsertRol(tipo_usuario);
        await db.query("INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (?, ?)", [newUserId, rolId]);

        // 5. Asignar carreras
        if (datos_estudio) {
            const carreras = JSON.parse(datos_estudio);
            // Filtra carreras únicas por nombre
            const carrerasUnicas = Array.from(
                new Set(
                    carreras
                        .filter(c => c.facultad.includes('CIENCIAS INFORMÁTICAS'))
                        .map(c => c.carrera)
                )
            );
            for (const nombreCarrera of carrerasUnicas) {
                const idCarrera = await insertCarreraIfNotExists(nombreCarrera);
                await db.query(
                    "INSERT INTO usuario_carrera (id_usuario, id_carrera) VALUES (?, ?)",
                    [newUserId, idCarrera]
                );
            }
        }

        await db.query("COMMIT");

        res.status(201).json({
            exito: true,
            mensaje: 'Usuario registrado exitosamente.'
        });

    } catch (error) {
        await db.query("ROLLBACK");
        res.status(500).json({
            exito: false,
            mensaje: 'Error del servidor al registrar el usuario.',
            error: error.message
        });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { usuario, password } = req.body;

        const body = {
            usuario: usuario, // Usa el email como usuario
            clave: password // Usa la contraseña proporcionada
        };

        // const apiData = await utmAuth(body, agent, res);
        const apiData = await externalAuth(body, res);

        if (apiData.statusCode === 400) {
            return;
        }

        // Verifica si el usuario existe en la base de datos
        const sql =
            `
        SELECT u.*, sr.nombre AS rol FROM usuario u
        LEFT JOIN usuario_rol ur ON ur.id_usuario = u.id
        LEFT JOIN sistema_rol sr ON sr.id = ur.id_rol
        WHERE u.cedula = ?
        `;
        const [usuarioExiste] = await db.query(sql, [apiData.cedula]);

        let user = null;

        if (usuarioExiste.length === 0) {
            await db.query("BEGIN");
            // Inserta un nuevo usuario en la base de datos
            const insertUserSql = `
                INSERT INTO usuario (id_personal, nombre, usuario, cedula)
                VALUES (?, ?, ?, ?) 
            `;
            const nombre = apiData.nombres;
            const rolId = await getOrInsertRol(apiData.tipo_usuario);
            const idpersonal = apiData.idpersonal;
            const [result] = await db.query(insertUserSql, [
                idpersonal,
                nombre,
                usuario,
                apiData.cedula
            ]);

            const asocialRolSql = "INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (?, ?)";
            const [asocialRol] = await db.query(asocialRolSql, [result.insertId, rolId]);

            if (asocialRol.affectedRows === 0) {
                return res.status(400).json({ exito: false, mensaje: 'Error al asociar el rol' });
            }

            // Inserta las carreras asociadas si no existen
            if (apiData.datos_estudio) {
                const carreras = JSON.parse(apiData.datos_estudio);
                for (const carrera of carreras) {
                    if (carrera.facultad.includes('CIENCIAS INFORMÁTICAS')) {
                        const idCarrera = await insertCarreraIfNotExists(carrera.carrera);
                        // Asocia la carrera al usuario
                        const [existingCarrera] = await db.query("SELECT * FROM usuario_carrera WHERE id_usuario = ? AND id_carrera = ?", [result.insertId, idCarrera]);

                        if (existingCarrera.length == 0) {
                            const asocialCarreraSql = "INSERT INTO usuario_carrera (id_usuario, id_carrera) VALUES (?, ?)";
                            const [asocialCarrera] = await db.query(asocialCarreraSql, [result.insertId, idCarrera]);

                            if (asocialCarrera.affectedRows === 0) {
                                return res.status(400).json({ exito: false, mensaje: 'Error al asociar la carrera' });
                            }
                        }
                    }
                }
            }
            await db.query("COMMIT");
            user = {
                id_personal: result.insertId,
                usuario: usuario,
            }
        }

        //registrar nombre de usuario si no esta registrado
        if(!usuarioExiste.find(u => u.usuario === usuario)) {
            const updateUserSql = "UPDATE usuario SET usuario = ? WHERE id = ?";
            await db.query(updateUserSql, [usuario, usuarioExiste[0].id]);
        }

        //no dejar que los estudiantes inicien sesión
        if (usuarioExiste.length > 0 && !usuarioExiste.find(u => u.rol === 'ESTUDIANTE')) {
            user = usuarioExiste[0];
        } else {
            return res.status(400).json({ exito: false, mensaje: 'Los estudiantes no pueden iniciar sesión' });
        }

        // Genera el token JWT
        const token = jwt.sign(
            { userId: user.id, usuario: user.usuario },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(200).json({
            exito: true,
            mensaje: 'Acceso exitoso',
            datos: token
        });

    } catch (error) {
        await db.query("ROLLBACK");
        res.status(500).json({
            exito: false,
            mensaje: 'Error del servidor al iniciar sesión',
            error: error.message
        });
    }
};

exports.getUserInfo = async (req, res) => {
    try {
        const { userId } = req.user;
        const sql = "SELECT * FROM usuario WHERE id = ?";
        const [user] = await db.query(sql, [userId]);

        if (user.length === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });
        }

        const rolesSql = "SELECT id, nombre FROM vista_roles_usuario WHERE id_usuario = ?";
        const [roles] = await db.query(rolesSql, [user[0].id]);

        const carreraSql = "SELECT * FROM usuario_carrera WHERE id_usuario = ?";
        const [carrera] = await db.query(carreraSql, [user[0].id]);
        // Obtener la foto del usuario
        let userPhotoBase64 = null;
        try {
            const photoResponse = await axios.post(
                "https://app.utm.edu.ec:3000/movil/obtener_foto_carnet",
                { idpersonal: user[0].id_personal }, {
                httpsAgent: agent
            }
            );

            const photoData = photoResponse.data[0]?.archivo_bin?.data;
            if (photoData) {
                // Convertir buffer a Base64
                userPhotoBase64 = Buffer.from(photoData).toString('base64');
            }
        } catch (photoError) {
            console.error("Error al obtener la foto del usuario:", photoError.message);
        }

        // Incluir la foto en la respuesta
        res.status(200).json({
            exito: true,
            mensaje: 'Datos del usuario',
            datos: {
                ...user[0],
                roles, // Agregar los roles asociados
                carreras: carrera.map(c => c.id_carrera), // Agregar las carreras asociadas
                fotoBase64: userPhotoBase64, // Agregar la foto en Base64
            }
        });

    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error del servidor al obtener usuario',
            error: error.message
        });
    }
};