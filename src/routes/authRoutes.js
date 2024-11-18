const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// Ruta de login con validación
router.post('/login', authController.loginUser);
router.post('/reset-password', authController.restablecerPassword);

module.exports = router;
