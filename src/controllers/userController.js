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

// Actualizar contraseña
exports.updateUser = async (id, password) => {
    try {
        const usuario = await Usuario.findOne({ where: { UsuarioID: id } });
        usuario.Contrasenia = password;
        await usuario.save();
        return usuario;
    } catch (error) {
        throw error;
    }
};