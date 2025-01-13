const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');

// CRUD de rutas
// router.post('/', rutasController.createRol);  // Crear una nueva ruta
router.get('/', rolesController.getRoles);    // Obtener todas las rutas

module.exports = router;
