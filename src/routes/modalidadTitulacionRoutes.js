const express = require('express');
const router = express.Router();
const modalidadController = require('../controllers/modalidadTitulacionController');
const auth = require('../middlewares/authMiddleware');
const onlyRoles = require('../middlewares/onlyTypeOfUsers');
const roles = [1, 10, 11];

// Rutas para CRUD de `modalidad_titulacion`
router.post('/crear', auth, onlyRoles(roles), modalidadController.crearModalidad);
router.get('/listar', auth, modalidadController.listarModalidades);
router.get('/listar/:id', auth, modalidadController.obtenerModalidad);
router.put('/actualizar/:id', auth, onlyRoles(roles), modalidadController.actualizarModalidad);
router.delete('/eliminar/:id', auth, onlyRoles(roles), modalidadController.eliminarModalidad);

// Rutas para gestionar `modalidad_titulacion_carrera`
router.post('/asociar', auth, onlyRoles(roles), modalidadController.asociarModalidadCarrera);
router.delete('/desasociar', auth, onlyRoles(roles), modalidadController.desasociarModalidadCarrera);
router.get('/listarPorCarrera/:id_carrera', auth, modalidadController.listarModalidadesPorCarrera);

module.exports = router;