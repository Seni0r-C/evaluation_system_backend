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