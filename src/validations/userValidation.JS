const { body } = require('express-validator');

exports.validateRegister = [
    body('cedula')
        .matches(/^\d{10}$/)
        .withMessage('La cédula debe tener 10 dígitos'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
];
