const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');

exports.loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Verifica si el usuario existe en la base de datos
        const usuario = await userController.getUserByCorreo(email);
        if (usuario.length === 0) {
            return res.status(400).json({ exito: false, mensaje: 'Usuario no encontrado' });
        }

        const user = usuario[0];

        // Compara la contraseña
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ exito: false, mensaje: 'Contraseña incorrecta' });
        }

        // Genera el token JWT
        const token = jwt.sign(
            { userId: user.UsuarioID, usuario: user.Email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Establece el token en una cookie segura
        res.cookie('jwt', token, {
            httpOnly: true,     // evita acceso desde JavaScript del cliente
            secure: process.env.NODE_ENV === 'production',  // solo en HTTPS en producción
            sameSite: 'strict', // previene el envío en solicitudes cruzadas
            maxAge: 24 * 60 * 60 * 1000 // opcional: tiempo de expiración en milisegundos
        });

        res.json({
            exito: true,
            mensaje: 'Acceso exitoso'
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error del servidor',
            error: error.message
        });
    }
};

exports.logoutUser = (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.json({
        exito: true,
        mensaje: 'Cierre de sesión exitoso'
    });
};
