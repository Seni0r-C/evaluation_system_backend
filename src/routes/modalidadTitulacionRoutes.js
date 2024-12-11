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

/**
 * @swagger
 * /modalidad-titulacion/crear:
 *   post:
 *     summary: Crear una nueva modalidad de titulación
 *     tags:
 *       - Modalidad Titulación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Proyecto Integrador"
 *               max_participantes:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Modalidad creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 max_participantes:
 *                   type: integer
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /modalidad-titulacion/listar:
 *   get:
 *     summary: Listar todas las modalidades de titulación
 *     tags:
 *       - Modalidad Titulación
 *     responses:
 *       200:
 *         description: Lista de modalidades
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
 *                   max_participantes:
 *                     type: integer
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /modalidad-titulacion/obtener/{id}:
 *   get:
 *     summary: Obtener una modalidad específica por su ID
 *     tags:
 *       - Modalidad Titulación
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la modalidad
 *     responses:
 *       200:
 *         description: Detalles de la modalidad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 max_participantes:
 *                   type: integer
 *       404:
 *         description: Modalidad no encontrada
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /modalidad-titulacion/actualizar/{id}:
 *   put:
 *     summary: Actualizar una modalidad de titulación
 *     tags:
 *       - Modalidad Titulación
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la modalidad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Tesis"
 *               max_participantes:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Modalidad actualizada exitosamente
 *       404:
 *         description: Modalidad no encontrada
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /modalidad-titulacion/eliminar/{id}:
 *   delete:
 *     summary: Eliminar una modalidad de titulación
 *     tags:
 *       - Modalidad Titulación
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la modalidad
 *     responses:
 *       200:
 *         description: Modalidad eliminada correctamente
 *       404:
 *         description: Modalidad no encontrada
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /modalidad-titulacion/asociar:
 *   post:
 *     summary: Asociar una modalidad de titulación a una carrera
 *     tags:
 *       - Modalidad Titulación Carrera
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_carrera:
 *                 type: integer
 *                 example: 1
 *               id_modalidad_titulacion:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Asociación creada exitosamente
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /modalidad-titulacion/desasociar:
 *   delete:
 *     summary: Desasociar una modalidad de titulación de una carrera
 *     tags:
 *       - Modalidad Titulación Carrera
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_carrera:
 *                 type: integer
 *                 example: 1
 *               id_modalidad_titulacion:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Asociación eliminada correctamente
 *       404:
 *         description: Asociación no encontrada
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /modalidad-titulacion/listarPorCarrera/{id_carrera}:
 *   get:
 *     summary: Listar modalidades de titulación por carrera
 *     tags:
 *       - Modalidad Titulación Carrera
 *     parameters:
 *       - in: path
 *         name: id_carrera
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la carrera
 *     responses:
 *       200:
 *         description: Lista de modalidades asociadas a la carrera
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
 *                   max_participantes:
 *                     type: integer
 *       500:
 *         description: Error interno del servidor
 */
