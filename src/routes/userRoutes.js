const express = require('express');
const router = express.Router();
const { validateRegister } = require('../validations/userValidation.JS');
const userController = require('../controllers/userController');

// Ruta para el registro de usuario con validación
router.post('/register', validateRegister, userController.registerUser);

module.exports = router;
