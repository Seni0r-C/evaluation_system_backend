const express = require('express');
const router = express.Router();
const trabajoController = require('../controllers/trabajoTitulacionController');

// CRUD de trabajos de titulación
router.post('/crear', trabajoController.crearTrabajo);
router.get('/listar', trabajoController.listarTrabajos);
router.get('/obtener/:id', trabajoController.obtenerTrabajo);
router.get('/estados', trabajoController.obtenerEstados);
router.put('/actualizar/:id', trabajoController.actualizarTrabajo);
router.delete('/eliminar/:id', trabajoController.eliminarTrabajo);

// Gestión de estudiantes en trabajos de titulación
router.post('/asociarEstudiante', trabajoController.asociarEstudiante);
router.delete('/desasociarEstudiante', trabajoController.desasociarEstudiante);

// Gestión de tribunales
router.post('/asignarTribunal', trabajoController.asignarTribunal);
router.delete('/removerTribunal', trabajoController.removerTribunal);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Trabajos de Titulación
 *   description: Gestión de trabajos de titulación, estudiantes asociados y tribunales.
 */

/**
 * @swagger
 * /trabajo-titulacion/crear:
 *   post:
 *     summary: Crea un nuevo trabajo de titulación.
 *     tags: [Trabajos de Titulación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               carrera_id:
 *                 type: integer
 *                 example: 1
 *               modalidad_id:
 *                 type: integer
 *                 example: 2
 *               tutor_id:
 *                 type: integer
 *                 example: 3
 *               cotutor_id:
 *                 type: integer
 *                 example: 4
 *               titulo:
 *                 type: string
 *                 example: "Análisis de datos en tiempo real"
 *               link_archivo:
 *                 type: string
 *                 example: "https://example.com/document.pdf"
 *     responses:
 *       201:
 *         description: Trabajo de titulación creado exitosamente.
 *       400:
 *         description: Error en los datos proporcionados.
 *       500:
 *         description: Error del servidor.
 */

/**
 * @swagger
 * /trabajo-titulacion/listar:
 *   get:
 *     summary: Lista todos los trabajos de titulación con paginación y filtros opcionales.
 *     tags: [Trabajos de Titulación]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de la página que se desea consultar (paginación).
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de registros por página (paginación).
 *       - in: query
 *         name: carrera_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filtra los trabajos por el ID de la carrera.
 *       - in: query
 *         name: modalidad_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filtra los trabajos por el ID de la modalidad.
 *       - in: query
 *         name: estado
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Registrado, En defensa, Aprobado, Reprobado]
 *         description: Filtra los trabajos por su estado.
 *       - in: query
 *         name: titulo
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtra los trabajos por el título, se realiza una búsqueda por coincidencia de texto.
 *     responses:
 *       200:
 *         description: Lista de trabajos de titulación con la paginación y filtros aplicados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       carrera_id:
 *                         type: integer
 *                       modalidad_id:
 *                         type: integer
 *                       tutor_id:
 *                         type: integer
 *                       cotutor_id:
 *                         type: integer
 *                       estado:
 *                         type: string
 *                       fecha_defensa:
 *                         type: string
 *                         format: date
 *                       titulo:
 *                         type: string
 *                       link_archivo:
 *                         type: string
 *                       carrera:
 *                         type: string
 *                       modalidad:
 *                         type: string
 *                 total:
 *                   type: integer
 *                   description: Total de trabajos de titulación que cumplen con los filtros.
 *                 page:
 *                   type: integer
 *                   description: Página actual solicitada.
 *                 totalPages:
 *                   type: integer
 *                   description: Total de páginas disponibles.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /trabajo-titulacion/obtener/{id}:
 *   get:
 *     summary: Obtiene un trabajo de titulación por su ID.
 *     tags: [Trabajos de Titulación]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo de titulación.
 *     responses:
 *       200:
 *         description: Detalles del trabajo de titulación.
 *       404:
 *         description: Trabajo no encontrado.
 *       500:
 *         description: Error del servidor.
 */

/**
 * @swagger
 * /trabajo-titulacion/actualizar/{id}:
 *   put:
 *     summary: Actualiza los datos de un trabajo de titulación.
 *     tags: [Trabajos de Titulación]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo de titulación.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Título actualizado"
 *               estado:
 *                 type: string
 *                 example: "En progreso"
 *               fecha_defensa:
 *                 type: string
 *                 format: date
 *                 example: "2024-05-15"
 *               link_archivo:
 *                 type: string
 *                 example: "https://example.com/document_updated.pdf"
 *     responses:
 *       200:
 *         description: Trabajo de titulación actualizado exitosamente.
 *       404:
 *         description: Trabajo no encontrado.
 *       500:
 *         description: Error del servidor.
 */

/**
 * @swagger
 * /trabajo-titulacion/eliminar/{id}:
 *   delete:
 *     summary: Elimina un trabajo de titulación por su ID.
 *     tags: [Trabajos de Titulación]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo de titulación.
 *     responses:
 *       200:
 *         description: Trabajo eliminado correctamente.
 *       404:
 *         description: Trabajo no encontrado.
 *       500:
 *         description: Error del servidor.
 */

/**
 * @swagger
 * /trabajo-titulacion/asociarEstudiante:
 *   post:
 *     summary: Asocia un estudiante a un trabajo de titulación.
 *     tags: [Trabajos de Titulación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trabajo_id:
 *                 type: integer
 *                 example: 1
 *               estudiante_id:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       201:
 *         description: Estudiante asociado exitosamente.
 *       500:
 *         description: Error del servidor.
 */

/**
 * @swagger
 * /trabajo-titulacion/desasociarEstudiante:
 *   delete:
 *     summary: Desasocia un estudiante de un trabajo de titulación.
 *     tags: [Trabajos de Titulación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trabajo_id:
 *                 type: integer
 *                 example: 1
 *               estudiante_id:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       200:
 *         description: Estudiante desasociado correctamente.
 *       404:
 *         description: Asociación no encontrada.
 *       500:
 *         description: Error del servidor.
 */

/**
 * @swagger
 * /trabajo-titulacion/asignarTribunal:
 *   post:
 *     summary: Asigna un tribunal a un trabajo de titulación.
 *     tags: [Trabajos de Titulación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trabajo_id:
 *                 type: integer
 *                 example: 1
 *               docente_id:
 *                 type: integer
 *                 example: 202
 *     responses:
 *       201:
 *         description: Tribunal asignado exitosamente.
 *       500:
 *         description: Error del servidor.
 */

/**
 * @swagger
 * /trabajo-titulacion/removerTribunal:
 *   delete:
 *     summary: Remueve un tribunal de un trabajo de titulación.
 *     tags: [Trabajos de Titulación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trabajo_id:
 *                 type: integer
 *                 example: 1
 *               docente_id:
 *                 type: integer
 *                 example: 202
 *     responses:
 *       200:
 *         description: Tribunal removido correctamente.
 *       404:
 *         description: Tribunal no encontrado.
 *       500:
 *         description: Error del servidor.
 */