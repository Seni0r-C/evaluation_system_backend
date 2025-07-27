const express = require('express');
const router = express.Router();
const rutasController = require('../controllers/rutasController');
const auth = require('../middlewares/authMiddleware');
const onlyRoles = require('../middlewares/onlyTypeOfUsers');
const roles = [1, 10, 11];

// CRUD de rutas
router.post('/crear', auth, onlyRoles(roles), rutasController.createRuta);  // Crear una nueva ruta
router.get('/listar', auth, rutasController.getRutas);    // Obtener todas las rutas
router.get('/rutas_rol', auth, rutasController.getRutasRol);    // Obtener todas las rutas
router.post('/hasAccess', auth, rutasController.hasAccess);      // Obtener una ruta específica
router.put('/actualizar/:id', auth, onlyRoles(roles), rutasController.updateRuta);  // Actualizar una ruta
router.delete('/eliminar/:id', auth, onlyRoles(roles), rutasController.deleteRuta);  // Eliminar una ruta

// Asignación y desasignación de roles a rutas
router.post('/:rutaId/roles/:rolId', auth, onlyRoles(roles), rutasController.assignRoleToRuta); // Asignar rol a una ruta
router.delete('/:rutaId/roles/:rolId', auth, onlyRoles(roles), rutasController.removeRoleFromRuta); // Eliminar rol de una ruta

//Menu

router.post('/menu', auth, onlyRoles(roles), rutasController.createMenu);

router.get('/menu', auth, rutasController.getMenus);

// Obtener el menu de un rol
router.get('/menu/:rol', auth, rutasController.getMenuByRol);

router.put('/menu/:id', auth, onlyRoles(roles), rutasController.updateMenu);

router.patch('/menu/reorder', auth, onlyRoles(roles), rutasController.reorderMenu);

router.delete('/menu/:id', auth, onlyRoles(roles), rutasController.deleteMenu);
// Obtener una ruta específica
module.exports = router;
