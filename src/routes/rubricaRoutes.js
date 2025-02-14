const express = require('express');
const router = express.Router();
const rubricaController = require('../controllers/rubricaController');

router.get('/modalidades', rubricaController.obtenerModalidades);
router.get('/tipos-evaluacion', rubricaController.obtenerTiposEvaluacion);
router.get('/criterios', rubricaController.obtenerCriteriosRubrica);
router.patch('/criterios', rubricaController.actualizarCriterioRubrica);

router.get("/criterios/:modalidad_id/:tipo_evaluacion_id", rubricaController.obtenerCriteriosRubrica2);
router.post("/criterios/crear", rubricaController.crearCriterioRubrica);
router.put("/criterios/:id", rubricaController.actualizarCriterioRubrica2);
router.delete("/criterios/:id", rubricaController.eliminarCriterioRubrica);
router.get("/tipos-evaluacion/:modalidad_id", rubricaController.obtenerTiposEvaluacionPorModalidad);

module.exports = router;