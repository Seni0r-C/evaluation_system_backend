const express = require('express');
const router = express.Router();
const modalidadController = require('../controllers/modalidadTitulacionController');

// Rutas para CRUD de `modalidad_titulacion`
router.post('/crear', modalidadController.crearModalidad);
router.get('/listar', modalidadController.listarModalidades);
router.get('/obtener/:id', modalidadController.obtenerModalidad);
router.put('/actualizar/:id', modalidadController.actualizarModalidad);
router.delete('/eliminar/:id', modalidadController.eliminarModalidad);

// Rutas para gestionar `modalidad_titulacion_carrera`
router.post('/asociar', modalidadController.asociarModalidadCarrera);
router.delete('/desasociar', modalidadController.desasociarModalidadCarrera);
router.get('/listarPorCarrera/:id_carrera', modalidadController.listarModalidadesPorCarrera);

module.exports = router;