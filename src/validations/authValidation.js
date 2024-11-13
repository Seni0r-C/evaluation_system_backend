const { body } = require('express-validator');

exports.validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Debe proporcionar un correo electrónico válido'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
];
