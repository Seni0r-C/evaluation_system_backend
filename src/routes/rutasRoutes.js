const express = require('express');
const router = express.Router();
const rutasController = require('../controllers/rutasController');

// CRUD de rutas
router.post('/crear', rutasController.createRuta);  // Crear una nueva ruta
router.get('/listar', rutasController.getRutas);    // Obtener todas las rutas
router.post('/hasAccess', rutasController.hasAccess);      // Obtener una ruta específica
router.get('/menu/:rol', rutasController.getMenuByRol);      // Obtener una ruta específica
router.put('/actualizar/:id', rutasController.updateRuta);  // Actualizar una ruta
router.delete('/eliminar/:id', rutasController.deleteRuta);  // Eliminar una ruta

// Asignación y desasignación de roles a rutas
router.post('/:rutaId/roles/:rolId', rutasController.assignRoleToRuta); // Asignar rol a una ruta
router.delete('/:rutaId/roles/:rolId', rutasController.removeRoleFromRuta); // Eliminar rol de una ruta

module.exports = router;
