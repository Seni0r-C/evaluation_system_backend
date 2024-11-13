// routes/facultadRoutes.js
const express = require('express');
const router = express.Router();
const facultadController = require('../controllers/facultadController');

// Rutas CRUD para Facultad
router.post('/', facultadController.createFacultad); // Crear
router.get('/', facultadController.getFacultades);   // Obtener todas
router.get('/:id', facultadController.getFacultadById); // Obtener por ID
router.put('/:id', facultadController.updateFacultad); // Actualizar
router.delete('/:id', facultadController.deleteFacultad); // Eliminar

module.exports = router;
