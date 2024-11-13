const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');

exports.registerUser = async (req, res) => {
    try {
        // Validación de errores en la solicitud
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Error de validación',
                errores: errors.array()
            });
        }

        const { cedula, password } = req.body;

        // Verifica si el usuario ya existe
        const usuarioExistente = await UserModel.getUserByCedula(cedula);
        if (usuarioExistente.length > 0) {
            return res.status(400).json({ exito: false, mensaje: 'El usuario ya existe' });
        }

        // Verifica el id_empleado
        const empleado = await UserModel.getEmployeeByCedula(cedula);
        if (empleado.length === 0) {
            return res.status(400).json({ exito: false, mensaje: 'El empleado no existe' });
        }

        const id_empleado = empleado[0].id_empleado;

        // Encripta la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserta el nuevo usuario en la base de datos
        await UserModel.createUser(id_empleado, cedula, hashedPassword);

        res.status(201).json({ exito: true, mensaje: 'Usuario registrado con éxito' });

    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error del servidor',
            error: error.message
        });
    }
};