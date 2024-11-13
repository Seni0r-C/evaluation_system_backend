const Usuario = require('../models/Usuario');

// Obtener usuario por correo
exports.getUserByCorreo = async (email) => {
    try {
        const usuario = await Usuario.findOne({ where: { email } });
        return usuario;
    } catch (error) {
        throw error;
    }
};