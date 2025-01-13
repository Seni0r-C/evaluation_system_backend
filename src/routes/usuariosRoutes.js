// usuariosRoutes.js
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Crear usuario
router.post('/', usuariosController.crearUsuario);

// Obtener todos los usuarios
router.get('/', usuariosController.obtenerUsuarios);

// Obtener usuario por ID
router.get('/:rol', usuariosController.obtenerUsuariosByRol);

//Obtener estudiantes por trabajo ID
router.get('/estudiantes/:id', usuariosController.obtenerEstudianteByTrabajo);

//Obtener foto de Usuario
router.get('/foto/:id', usuariosController.obtenerFotoUsuario);

// Actualizar usuario
router.put('/:id', usuariosController.actualizarUsuario);

// Eliminar usuario
router.delete('/:id', usuariosController.eliminarUsuario);

module.exports = router;