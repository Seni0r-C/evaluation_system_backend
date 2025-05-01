const express = require('express');
const router = express.Router();
const controller = require('../controllers/calificacionController');
const auth = require('../middlewares/authMiddleware');
const onlyRoles = require('../middlewares/onlyTypeOfUsers');
const roles = [1, 10, 11];

// Rutas para tipos de evaluación
router.post('/tipo-evaluacion', auth, onlyRoles(roles), controller.createTipoEvaluacion);
router.get('/tipo-evaluacion', auth, controller.getTiposEvaluacion);
router.get('/tipo-evaluacion/:id', auth, controller.getTipoEvaluacionByModalidadId);
router.put('/tipo-evaluacion/:id', auth, onlyRoles(roles), controller.updateTipoEvaluacion);
router.delete('/tipo-evaluacion/:id', auth, onlyRoles(roles), controller.deleteTipoEvaluacion);

//jerarquia de tipos de evaluación
router.post('/tipo-evaluacion-jerarquia', auth, onlyRoles(roles), controller.createJerarquia);
router.get('/tipo-evaluacion-jerarquia', auth, controller.getJerarquias);
router.put('/tipo-evaluacion-jerarquia/:id', auth, onlyRoles(roles), controller.updateJerarquia);
router.delete('/tipo-evaluacion-jerarquia/:id', auth, onlyRoles(roles), controller.deleteJerarquia);

// Rutas para rubrica
router.post('/rubrica', auth, onlyRoles(roles), controller.createRubrica);
router.get('/rubrica', auth, controller.getRubrica);
router.put('/rubrica/:id', auth, onlyRoles(roles), controller.updateRubrica);
router.delete('/rubrica/:id', auth, onlyRoles(roles), controller.deleteRubrica);

// Rutas para rubrica_criterio
router.post('/rubrica-criterio', auth, onlyRoles(roles), controller.createRubricaCriterio);
router.get('/rubrica-criterio', auth, controller.getRubricaCriterios);
router.get('/rubrica-criterio/:id', auth, controller.getRubricaCriterioById);
router.put('/rubrica-criterio/:id', auth, onlyRoles(roles), controller.updateRubricaCriterio);
router.delete('/rubrica-criterio/:id', auth, onlyRoles(roles), controller.deleteRubricaCriterio);

// Rutas para rubrica_evaluación
router.get('/rubrica-evaluacion-notas', auth, controller.getGradesRubricCriterial);
router.post('/rubrica-evaluacion', auth, controller.createRubricaEvaluaciones);
router.get('/rubrica-evaluacion', auth, controller.getRubricaEvaluaciones);
router.get('/rubrica-evaluacion/:id', auth, controller.getRubricaEvaluacionById);
router.put('/rubrica-evaluacion/:id', auth, onlyRoles(roles), controller.updateRubricaEvaluacion)
router.post('/rubrica-evaluacion-examen-teorico', auth, controller.createRubricaEvaluacionExamenTeorico);
router.get('/rubrica-evaluacion-examen-teorico/:trabajo_id', auth, controller.geValueOfExamenTeoricoGradeByTrabajoIdController);

// Exportar las rutas
module.exports = router;