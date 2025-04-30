// usuariosRoutes.js
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const auth = require('../middlewares/authMiddleware');
const onlyRoles = require('../middlewares/onlyTypeOfUsers');
const roles = [1, 10, 11, 12];

// Crear usuario
router.post('/', auth, onlyRoles(roles), usuariosController.crearUsuario);

// Obtener todos los usuarios
router.get('/', auth, usuariosController.obtenerUsuarios);

// Obtener usuario por ID
router.get('/:rol', auth, usuariosController.obtenerUsuariosByRol);

//Obtener estudiantes por trabajo ID
router.get('/estudiantes/:id', auth, usuariosController.obtenerEstudianteByTrabajo);

//Obtener foto de Usuario
router.get('/foto/:id', auth, usuariosController.obtenerFotoUsuario);

// Actualizar usuario
router.put('/:id', auth, onlyRoles(roles), usuariosController.actualizarUsuario);

// Eliminar usuario
router.delete('/:id', auth, onlyRoles(roles), usuariosController.eliminarUsuario);

module.exports = router;