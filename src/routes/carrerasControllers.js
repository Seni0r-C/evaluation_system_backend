const express = require('express');
const router = express.Router();
const carreraController = require('../controllers/carrerasController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas de carrera
router.post('/crear', carreraController.createCarrera);
router.get('/listar', carreraController.getCarreras);
router.get('/listar/:id', carreraController.getCarreraById);
router.put('/actualizar/:id', carreraController.updateCarrera);
router.delete('/eliminar/:id', carreraController.deleteCarrera);

module.exports = router;

/**
 * @swagger
 * /carrera/crear:
 *   post:
 *     summary: Crear una nueva carrera
 *     tags:
 *       - Carrera
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la carrera
 *                 example: "Ingeniería Civil"
 *               id_facultad:
 *                 type: integer
 *                 description: ID de la facultad a la que pertenece
 *                 example: 2
 *     responses:
 *       201:
 *         description: Carrera creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Carrera creada"
 *                 id:
 *                   type: integer
 *                   description: ID de la carrera creada
 *                   example: 5
 *       500:
 *         description: Error al crear la carrera
 */

/**
 * @swagger
 * /carrera/listar:
 *   get:
 *     summary: Listar todas las carreras
 *     tags:
 *       - Carrera
 *     security:
 *       - bearerAuth: []  # Indica que requiere autenticación
 *     responses:
 *       200:
 *         description: Lista de carreras obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Carreras obtenidas"
 *                 datos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID de la carrera
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         description: Nombre de la carrera
 *                         example: "Ingeniería en Sistemas"
 *                       id_facultad:
 *                         type: integer
 *                         description: ID de la facultad a la que pertenece
 *                         example: 2
 *       500:
 *         description: Error al obtener las carreras
 */

/**
 * @swagger
 * /carrera/listar/{id}:
 *   get:
 *     summary: Obtener una carrera por su ID
 *     tags:
 *       - Carrera
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la carrera a obtener
 *     responses:
 *       200:
 *         description: Carrera obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Carrera obtenida"
 *                 datos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID de la carrera
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         description: Nombre de la carrera
 *                         example: "Ingeniería en Sistemas"
 *                       id_facultad:
 *                         type: integer
 *                         description: ID de la facultad a la que pertenece
 *                         example: 2
 *       404:
 *         description: Carrera no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: "Carrera no encontrada"
 *       500:
 *         description: Error al obtener la carrera
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: "Error al obtener la carrera"
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Error al conectarse a la base de datos"
 */

/**
 * @swagger
 * /carrera/actualizar/{id}:
 *   put:
 *     summary: Actualizar una carrera existente
 *     tags:
 *       - Carrera
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la carrera a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nuevo nombre de la carrera
 *                 example: "Ingeniería Mecánica"
 *               id_facultad:
 *                 type: integer
 *                 description: Nuevo ID de la facultad
 *                 example: 3
 *     responses:
 *       200:
 *         description: Carrera actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Carrera actualizada"
 *       404:
 *         description: Carrera no encontrada
 *       500:
 *         description: Error al actualizar la carrera
 */

/**
 * @swagger
 * /carrera/eliminar/{id}:
 *   delete:
 *     summary: Eliminar una carrera existente
 *     tags:
 *       - Carrera
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la carrera a eliminar
 *     responses:
 *       200:
 *         description: Carrera eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Carrera eliminada"
 *       404:
 *         description: Carrera no encontrada
 *       500:
 *         description: Error al eliminar la carrera
 */