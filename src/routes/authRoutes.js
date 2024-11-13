const express = require('express');
const router = express.Router();
const { validateLogin } = require('../validations/authValidation');
const authController = require('../controllers/authController');
// Ruta de login con validación
router.post('/login', validateLogin, authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/reset-password', validateLogin, authController.restablecerPassword);

module.exports = router;
