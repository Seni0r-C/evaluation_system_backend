const express = require('express');
const router = express.Router();
const trabajoController = require('../controllers/trabajoTitulacionController');
const auth = require('../middlewares/authMiddleware');
const onlyRoles = require('../middlewares/onlyTypeOfUsers');
const roles = [1, 10, 11, 12];

// CRUD de trabajos de titulación
router.post('/crear', auth, onlyRoles(roles), trabajoController.crearTrabajo);
router.get('/listar', auth, trabajoController.listarTrabajos);
router.get('/listar-tri', auth, trabajoController.listarTrabajosForTribunal);
router.get('/obtener/:id', auth, trabajoController.obtenerTrabajo);
router.get('/estados', auth, trabajoController.obtenerEstados);
router.patch('/actualizar/:id', auth, onlyRoles(roles), trabajoController.actualizarTrabajo);
router.delete('/eliminar/:id', auth, onlyRoles(roles), trabajoController.eliminarTrabajo);
router.get('/tribunal/:trabajo_id', auth, trabajoController.getThesisTribunalMembers);

// Gestión de estudiantes en trabajos de titulación
router.post('/asociarEstudiante', auth, onlyRoles(roles), trabajoController.asociarEstudiante);
router.delete('/desasociarEstudiante', auth, onlyRoles(roles), trabajoController.desasociarEstudiante);

// Gestión de tribunales
router.post('/asignarTribunal', auth, onlyRoles(roles), trabajoController.asignarTribunal);
router.post('/reasignarTribunal', auth, onlyRoles(roles), trabajoController.reasignarTribunal);
router.get('/obtenerTribunal/:id', auth, trabajoController.obtenerTribunal);
router.delete('/removerTribunal', auth, onlyRoles(roles), trabajoController.removerTribunal);

module.exports = router;