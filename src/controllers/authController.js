const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const axios = require('axios');
require('dotenv').config();
const https = require('https');

const agent = new https.Agent({
    rejectUnauthorized: false
});

exports.loginUser = async (req, res) => {
    try {
        const { usuario, password } = req.body;

        // Hace la petición al endpoint externo
        const apiUrl = "https://app.utm.edu.ec/becas/api/publico/IniciaSesion";

        const body = {
            usuario: usuario, // Usa el email como usuario
            clave: password // Usa la contraseña proporcionada
        };

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

        // Verifica si el usuario existe en la base de datos
        const sql = "SELECT * FROM utm.usuario WHERE usuario = ?";
        const [usuarioExiste] = await db.query(sql, [usuario]);

        let user = null;

        if (usuarioExiste.length === 0) {
            // Inserta un nuevo usuario en la base de datos
            const insertUserSql = `
                INSERT INTO utm.usuario (id_personal, nombre, apellido, usuario, id_rol) 
                VALUES (?, ?, ?, ?, ?)
            `;
            const [nombre, apellido] = apiData.nombres.split(" ");
            const rolId = await getOrInsertRol(apiData.tipo_usuario);

            await db.query(insertUserSql, [
                apiData.idpersonal,
                nombre,
                apellido,
                usuario,
                rolId
            ]);

            // Inserta las carreras asociadas si no existen
            if (apiData.datos_estudio) {
                const carreras = JSON.parse(apiData.datos_estudio);
                for (const carrera of carreras) {
                    await insertCarreraIfNotExists(carrera.carrera);
                }
            }

            user = {
                id_personal: apiData.idpersonal,
                usuario: usuario,
            }
        } else {
            user = usuarioExiste[0];
        }

        // Genera el token JWT
        const token = jwt.sign(
            { userId: user.id_personal, usuario: user.usuario },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            exito: true,
            mensaje: 'Acceso exitoso',
            datos: token
        });

    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error del servidor',
            error: error.message
        });
    }
};

// Función para obtener o insertar un rol
async function getOrInsertRol(tipoUsuario) {
    const selectRolSql = "SELECT id FROM utm.rol WHERE nombre = ?";
    const [rol] = await db.query(selectRolSql, [tipoUsuario]);

    if (rol.length > 0) {
        return rol[0].id;
    }

    const insertRolSql = "INSERT INTO utm.rol (nombre) VALUES (?)";
    const result = await db.query(insertRolSql, [tipoUsuario]);
    return result.insertId;
}

// Función para insertar carrera si no existe
async function insertCarreraIfNotExists(nombreCarrera) {
    const selectCarreraSql = "SELECT id FROM utm.carrera WHERE nombre = ?";
    const [carrera] = await db.query(selectCarreraSql, [nombreCarrera]);

    if (carrera.length === 0) {
        const insertCarreraSql = "INSERT INTO utm.carrera (nombre) VALUES (?)";
        await db.query(insertCarreraSql, [nombreCarrera]);
    }
}

exports.restablecerPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verifica si el usuario existe en la base de datos
        let sql = "SELECT * FROM utm.usuario WHERE Email = ?";
        const [usuario] = await db.query(sql, [email]);

        if (usuario.length === 0) {
            return res.status(400).json({ exito: false, mensaje: 'Usuario no encontrado' });
        }
        const user = usuario[0];

        // Cambia la contraseña
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);
        sql = "UPDATE utm.usuario SET contrasenia = ? WHERE email = ?";
        const [result] = await db.query(sql, [newPassword, user.email]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ exito: false, mensaje: 'Error al cambiar la contraseña' });
        }

        res.json({
            exito: true,
            mensaje: 'Contraseña cambiada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error del servidor',
            error: error.message
        });
    }
};

exports.registerUser = async (req, res) => {
    try {
        const { nombre, apellido, email, password, id_rol } = req.body;

        // Verifica si el email ya está registrado
        const sqlCheck = "SELECT * FROM utm.usuario WHERE Email = ?";
        const [existingUser] = await db.query(sqlCheck, [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ exito: false, mensaje: 'El correo ya está registrado' });
        }

        // Cifra la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Inserta el nuevo usuario en la base de datos
        const sqlInsert = "INSERT INTO utm.usuario (nombre, apellido, email, contrasenia, id_rol) VALUES (?, ?, ?, ?, ?)";
        const [result] = await db.query(sqlInsert, [nombre, apellido, email, hashedPassword, id_rol]);

        res.status(201).json({
            exito: true,
            mensaje: 'Usuario registrado exitosamente',
            datos: { id: result.insertId, nombre, apellido, email, id_rol }
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error del servidor',
            error: error.message
        });
    }
};

exports.getAuthenticatedUser = async (req, res) => {
    try {
        const { userId } = req.user;
        const sql = "SELECT * FROM utm.usuario WHERE id = ?";
        const [user] = await db.query(sql, [userId]);
        if (user.length === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });
        }
        res.status(200).json({
            exito: true,
            mensaje: 'Datos del usuario',
            datos: user[0]
        });

    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error del servidor',
            error: error.message
        });
    }
};