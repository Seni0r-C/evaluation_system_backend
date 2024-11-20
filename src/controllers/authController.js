const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verifica si el usuario existe en la base de datos
        const sql = "SELECT * FROM Usuario WHERE Email = ?";
        const [usuario] = await db.query(sql, [email]);

        if (usuario.length === 0) {
            return res.status(400).json({ exito: false, mensaje: 'Usuario no encontrado' });
        }
        const user = usuario[0];
        // Compara la contraseña
        const isMatch = await bcrypt.compare(password, user.contrasenia);
        if (!isMatch) {
            return res.status(400).json({ exito: false, mensaje: 'Contraseña incorrecta' });
        }

        // Genera el token JWT
        const token = jwt.sign(
            { userId: user.id, usuario: user.email },
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

exports.restablecerPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verifica si el usuario existe en la base de datos
        let sql = "SELECT * FROM Usuario WHERE Email = ?";
        const [usuario] = await db.query(sql, [email]);

        if (usuario.length === 0) {
            return res.status(400).json({ exito: false, mensaje: 'Usuario no encontrado' });
        }
        const user = usuario[0];

        // Cambia la contraseña
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);
        sql = "UPDATE usuario SET contrasenia = ? WHERE email = ?";
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