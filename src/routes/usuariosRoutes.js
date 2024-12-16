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

// Actualizar usuario
router.put('/:id', usuariosController.actualizarUsuario);

// Eliminar usuario
router.delete('/:id', usuariosController.eliminarUsuario);

module.exports = router;



/**
 * @swagger
 * /usuarios/:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Crea un nuevo usuario
 *     description: Crea un nuevo usuario en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               email:
 *                 type: string
 *               contrasenia:
 *                 type: string
 *               id_rol:
 *                 type: integer
 *             required:
 *               - nombre
 *               - apellido
 *               - email
 *               - contrasenia
 *               - id_rol
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: integer
 *       500:
 *         description: Error al crear el usuario
 */

/**
 * @swagger
 * /usuarios/:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Obtiene la lista de todos los usuarios
 *     description: Devuelve todos los usuarios registrados en el sistema.
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   apellido:
 *                     type: string
 *                   email:
 *                     type: string
 *                   id_rol:
 *                     type: integer
 *       500:
 *         description: Error al obtener los usuarios
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Obtiene un usuario por su ID
 *     description: Devuelve los detalles de un usuario específico utilizando su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El ID del usuario que se quiere obtener.
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 apellido:
 *                   type: string
 *                 email:
 *                   type: string
 *                 id_rol:
 *                   type: integer
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al obtener el usuario
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     tags:
 *       - Usuarios
 *     summary: Actualiza los datos de un usuario
 *     description: Actualiza los detalles de un usuario existente utilizando su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El ID del usuario que se desea actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               email:
 *                 type: string
 *               contrasenia:
 *                 type: string
 *               id_rol:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al actualizar el usuario
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     tags:
 *       - Usuarios
 *     summary: Elimina un usuario por su ID
 *     description: Elimina un usuario del sistema utilizando su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El ID del usuario que se desea eliminar.
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al eliminar el usuario
 */