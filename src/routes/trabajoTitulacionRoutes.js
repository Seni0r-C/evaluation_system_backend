const express = require('express');
const router = express.Router();
const trabajoController = require('../controllers/trabajoTitulacionController');

// CRUD de trabajos de titulación
router.post('/crear', trabajoController.crearTrabajo);
router.get('/listar', trabajoController.listarTrabajos);
router.get('/obtener/:id', trabajoController.obtenerTrabajo);
router.get('/estados', trabajoController.obtenerEstados);
router.patch('/actualizar/:id', trabajoController.actualizarTrabajo);
router.delete('/eliminar/:id', trabajoController.eliminarTrabajo);

// Gestión de estudiantes en trabajos de titulación
router.post('/asociarEstudiante', trabajoController.asociarEstudiante);
router.delete('/desasociarEstudiante', trabajoController.desasociarEstudiante);

// Gestión de tribunales
router.post('/asignarTribunal', trabajoController.asignarTribunal);
router.post('/reasignarTribunal', trabajoController.reasignarTribunal);
router.get('/obtenerTribunal/:id', trabajoController.obtenerTribunal);
router.delete('/removerTribunal', trabajoController.removerTribunal);

module.exports = router;