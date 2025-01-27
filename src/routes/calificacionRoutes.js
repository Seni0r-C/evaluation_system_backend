const express = require('express');
const router = express.Router();
const controller = require('../controllers/calificacionController');

// Rutas para tipos de evaluación
router.post('/tipo-evaluacion', controller.createTipoEvaluacion);
router.get('/tipo-evaluacion', controller.getTiposEvaluacion);
router.get('/tipo-evaluacion/:id', controller.getTipoEvaluacionByModalidadId);
router.put('/tipo-evaluacion/:id', controller.updateTipoEvaluacion);
router.delete('/tipo-evaluacion/:id', controller.deleteTipoEvaluacion);

// Rutas para rubrica
router.post('/rubrica', controller.createRubrica);
router.get('/rubrica', controller.getRubrica);
router.put('/rubrica/:id', controller.updateRubrica);
router.delete('/rubrica/:id', controller.deleteRubrica);

// Rutas para rubrica_criterio
router.post('/rubrica-criterio', controller.createRubricaCriterio);
router.get('/rubrica-criterio', controller.getRubricaCriterios);
router.get('/rubrica-criterio/:id', controller.getRubricaCriterioById);
router.put('/rubrica-criterio/:id', controller.updateRubricaCriterio);
router.delete('/rubrica-criterio/:id', controller.deleteRubricaCriterio);

// Rutas para rubrica_evaluación
router.post('/rubrica-evaluacion', controller.createRubricaEvaluaciones);
router.get('/rubrica-evaluacion', controller.getRubricaEvaluaciones);
router.get('/rubrica-evaluacion/:id', controller.getRubricaEvaluacionById);
router.put('/rubrica-evaluacion/:id', controller.updateRubricaEvaluacion)

// Exportar las rutas
module.exports = router;