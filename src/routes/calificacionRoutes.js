// calificacionRoutes.js
const express = require('express');
const router = express.Router();
const calificacionController = require('../controllers/calificacionController');

// Rutas para tipo_evaluacion
router.post('/tipo-evaluacion', calificacionController.createTipoEvaluacion);
router.get('/tipo-evaluacion', calificacionController.getTiposEvaluacion);
router.get('/tipo-evaluacion/:id', calificacionController.getTipoEvaluacionById);
router.put('/tipo-evaluacion/:id', calificacionController.updateTipoEvaluacion);
router.delete('/tipo-evaluacion/:id', calificacionController.deleteTipoEvaluacion);

// Rutas para rubrica
router.post('/rubrica', calificacionController.createRubrica);
router.get('/rubrica', calificacionController.getRubricas);
router.get('/rubrica/:id', calificacionController.getRubricaById);
router.put('/rubrica/:id', calificacionController.updateRubrica);
router.delete('/rubrica/:id', calificacionController.deleteRubrica);

// Similar para rubrica_criterio, rubrica_nivel y rubrica_evaluacion
router.post('/rubrica-criterio', calificacionController.createRubricaCriterio);
router.get('/rubrica-criterio', calificacionController.getRubricaCriterios);
router.get('/rubrica-criterio/:id', calificacionController.getRubricaCriterioById);
router.put('/rubrica-criterio/:id', calificacionController.updateRubricaCriterio);
router.delete('/rubrica-criterio/:id', calificacionController.deleteRubricaCriterio);

router.post('/rubrica-nivel', calificacionController.createRubricaNivel);
router.get('/rubrica-nivel', calificacionController.getRubricaNiveles);
router.get('/rubrica-nivel/:id', calificacionController.getRubricaNivelById);
router.put('/rubrica-nivel/:id', calificacionController.updateRubricaNivel);
router.delete('/rubrica-nivel/:id', calificacionController.deleteRubricaNivel);

router.post('/rubrica-evaluacion', calificacionController.createRubricaEvaluacion);
router.get('/rubrica-evaluacion', calificacionController.getRubricaEvaluaciones);
router.get('/rubrica-evaluacion/:id', calificacionController.getRubricaEvaluacionById);
router.put('/rubrica-evaluacion/:id', calificacionController.updateRubricaEvaluacion)

// Exportar las rutas
module.exports = router;

// Rutas para tipo_evaluacion
/**
 * @swagger
 * tags:
 *   - name: Calificación - Tipo Evaluación
 *     description: Operaciones relacionadas con los tipos de evaluación
 */

/**
 * @swagger
 * /calificacion/tipo-evaluacion:
 *   post:
 *     summary: Crear un nuevo tipo de evaluación
 *     tags: [Calificación - Tipo Evaluación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoEvaluacion'
 *     responses:
 *       201:
 *         description: Tipo de evaluación creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoEvaluacion'
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /calificacion/tipo-evaluacion/{id}:
 *   get:
 *     summary: Obtener un tipo de evaluación por ID
 *     tags: [Calificación - Tipo Evaluación]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de evaluación a obtener
 *     responses:
 *       200:
 *         description: Tipo de evaluación encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoEvaluacion'
 *       404:
 *         description: Tipo de evaluación no encontrado
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /calificacion/tipo-evaluacion/{id}:
 *   put:
 *     summary: Actualizar un tipo de evaluación por ID
 *     tags: [Calificación - Tipo Evaluación]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de evaluación a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoEvaluacion'
 *     responses:
 *       200:
 *         description: Tipo de evaluación actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoEvaluacion'
 *       404:
 *         description: Tipo de evaluación no encontrado
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /calificacion/tipo-evaluacion/{id}:
 *   delete:
 *     summary: Eliminar un tipo de evaluación por ID
 *     tags: [Calificación - Tipo Evaluación]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de evaluación a eliminar
 *     responses:
 *       204:
 *         description: Tipo de evaluación eliminado exitosamente
 *       404:
 *         description: Tipo de evaluación no encontrado
 *       500:
 *         description: Error en el servidor
 */

// Rutas para rubrica
/**
 * @swagger
 * tags:
 *   - name: Calificación - Rubrica
 *     description: Operaciones relacionadas con las rubricas
 */

/**
 * @swagger
 * /calificacion/rubrica:
 *   post:
 *     summary: Crear una nueva rubrica
 *     tags: [Calificación - Rubrica]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rubrica'
 *     responses:
 *       201:
 *         description: Rubrica creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rubrica'
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /calificacion/rubrica:
 *   get:
 *     summary: Obtener todas las rubricas
 *     tags: [Calificación - Rubrica]
 *     responses:
 *       200:
 *         description: Lista de rubricas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rubrica'
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /calificacion/rubrica/{id}:
 *   get:
 *     summary: Obtener una rubrica por ID
 *     tags: [Calificación - Rubrica]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la rubrica a obtener
 *     responses:
 *       200:
 *         description: Rubrica encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rubrica'
 *       404:
 *         description: Rubrica no encontrada
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /calificacion/rubrica/{id}:
 *   put:
 *     summary: Actualizar una rubrica por ID
 *     tags: [Calificación - Rubrica]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la rubrica a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rubrica'
 *     responses:
 *       200:
 *         description: Rubrica actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rubrica'
 *       404:
 *         description: Rubrica no encontrada
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /calificacion/rubrica/{id}:
 *   delete:
 *     summary: Eliminar una rubrica por ID
 *     tags: [Calificación - Rubrica]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la rubrica a eliminar
 *     responses:
 *       204:
 *         description: Rubrica eliminada exitosamente
 *       404:
 *         description: Rubrica no encontrada
 *       500:
 *         description: Error en el servidor
 */

// Rutas para rubrica_criterio
/**
 * @swagger
 * tags:
 *   - name: Calificación - Rubrica Criterio
 *     description: Operaciones relacionadas con los criterios de rubricas
 */

/**
 * @swagger
 * /calificacion/rubrica-criterio:
 *   post:
 *     summary: Crear un nuevo criterio de rubrica
 *     tags: [Calificación - Rubrica Criterio]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RubricaCriterio'
 *     responses:
 *       201:
 *         description: Criterio de rubrica creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RubricaCriterio'
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /calificacion/rubrica-criterio:
 *   get:
 *     summary: Obtener todas los criterios de rubrica
 *     tags: [Calificación - Rubrica Criterio]
 *     responses:
 *       200:
 *         description: Lista de criterios de rubrica
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RubricaCriterio'
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /calificacion/rubrica-criterio/{id}:
 *   get:
 *     summary: Obtener un criterio de rubrica por ID
 *     tags: [Calificación - Rubrica Criterio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del criterio de rubrica a obtener
 *     responses:
 *       200:
 *         description: Criterio de rubrica encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RubricaCriterio'
 *       404:
 *         description: Criterio de rubrica no encontrado
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /calificacion/rubrica-criterio/{id}:
 *   put:
 *     summary: Actualizar un criterio de rubrica por ID
 *     tags: [Calificación - Rubrica Criterio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del criterio de rubrica a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RubricaCriterio'
 *     responses:
 *       200:
 *         description: Criterio de rubrica actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RubricaCriterio'
 *       404:
 *         description: Criterio de rubrica no encontrado
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /calificacion/rubrica-criterio/{id}:
 *   delete:
 *     summary: Eliminar un criterio de rubrica
 *     tags: [Calificación - Rubrica Criterio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del criterio de rubrica a eliminar
 *     responses:
 *       204:
 *         description: Criterio de rubrica eliminado exitosamente
 *       404:
 *         description: Criterio de rubrica no encontrado
 *       500:
 *         description: Error en el servidor
 */

// Rutas para rubrica_nivel
/**
 * @swagger
 * tags:
 *   - name: Calificación - Rubrica Nivel
 *     description: Operaciones relacionadas con los niveles de una rubrica
 */

/**
 * @swagger
 * /calificacion/rubrica-nivel:
 *   post:
 *     summary: Crear un nuevo nivel de una rubrica
 *     tags: [Calificación - Rubrica Nivel]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RubricaNivel'
 *     responses:
 *       201:
 *         description: Nivel de rubrica creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RubricaNivel'
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /calificacion/rubrica-nivel:
 *   get:
 *     summary: Obtener todas los niveles de una rubrica
 *     tags: [Calificación - Rubrica Nivel]
 *     responses:
 *       200:
 *         description: Lista de niveles de rubrica
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RubricaNivel'
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /calificacion/rubrica-nivel/{id}:
 *   get:
 *     summary: Obtener un nivel de una rubrica por ID
 *     tags: [Calificación - Rubrica Nivel]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del nivel de rubrica a obtener
 *     responses:
 *       200:
 *         description: Nivel de rubrica encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RubricaNivel'
 *       404:
 *         description: Nivel de rubrica no encontrado
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /calificacion/rubrica-nivel/{id}:
 *   put:
 *     summary: Actualizar un nivel de una rubrica por ID
 *     tags: [Calificación - Rubrica Nivel]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del nivel de rubrica a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RubricaNivel'
 *     responses:
 *       200:
 *         description: Nivel de rubrica actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RubricaNivel'
 *       404:
 *         description: Nivel de rubrica no encontrado
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /calificacion/rubrica-nivel/{id}:
 *   delete:
 *     summary: Eliminar un nivel de una rubrica por ID
 *     tags: [Calificación - Rubrica Nivel]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del nivel de rubrica a eliminar
 *     responses:
 *       204:
 *         description: Nivel de rubrica eliminado exitosamente
 *       404:
 *         description: Nivel de rubrica no encontrado
 *       500:
 *         description: Error en el servidor
 */

// Rutas para rubrica_evaluacion
/**
 * @swagger
 * tags:
 *   - name: Calificación - Rubrica Evaluacion
 *     description: Operaciones relacionadas con las evaluaciones de una rubrica
 */

/**
 * @swagger
 * /calificacion/rubrica-evaluacion:
 *   post:
 *     summary: Crear una nueva evaluación de una rubrica
 *     tags: [Calificación - Rubrica Evaluacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RubricaEvaluacion'
 *     responses:
 *       201:
 *         description: Evaluación de rubrica creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RubricaEvaluacion'
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /calificacion/rubrica-evaluacion:
 *   get:
 *     summary: Obtener todas las evaluaciones de rubrica
 *     tags: [Calificación - Rubrica Evaluacion]
 *     responses:
 *       200:
 *         description: Lista de evaluaciones de rubrica
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RubricaEvaluacion'
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /calificacion/rubrica-evaluacion/{id}:
 *   get:
 *     summary: Obtener una evaluación de rubrica por ID
 *     tags: [Calificación - Rubrica Evaluacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la evaluación de rubrica a obtener
 *     responses:
 *       200:
 *         description: Evaluación de rubrica encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RubricaEvaluacion'
 *       404:
 *         description: Evaluación de rubrica no encontrada
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /calificacion/rubrica-evaluacion/{id}:
 *   put:
 *     summary: Actualizar una evaluación de rubrica por ID
 *     tags: [Calificación - Rubrica Evaluacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la evaluación de rubrica a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RubricaEvaluacion'
 *     responses:
 *       200:
 *         description: Evaluación de rubrica actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RubricaEvaluacion'
 *       404:
 *         description: Evaluación de rubrica no encontrada
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /calificacion/rubrica-evaluacion/{id}:
 *   delete:
 *     summary: Eliminar una evaluación de rubrica por ID
 *     tags: [Calificación - Rubrica Evaluacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la evaluación de rubrica a eliminar
 *     responses:
 *       204:
 *         description: Evaluación de rubrica eliminada exitosamente
 *       404:
 *         description: Evaluación de rubrica no encontrada
 *       500:
 *         description: Error en el servidor
 */