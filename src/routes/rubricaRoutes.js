const express = require('express');
const router = express.Router();
const rubricaController = require('../controllers/rubricaController');
const auth = require('../middlewares/authMiddleware');
const onlyRoles = require('../middlewares/onlyTypeOfUsers');
const roles = [1, 10, 11];

router.get('/modalidades', auth, rubricaController.obtenerModalidades);
router.get('/tipos-evaluacion', auth, rubricaController.obtenerTiposEvaluacion);
router.get("/tipos-evaluacion/:modalidad_id", auth, rubricaController.obtenerTiposEvaluacionPorModalidad);
router.get('/criterios', auth, rubricaController.obtenerCriteriosRubrica);
router.patch('/criterios', auth, onlyRoles(roles), rubricaController.actualizarCriterioRubrica);

router.get("/criterios/:modalidad_id/:tipo_evaluacion_id", auth, rubricaController.obtenerCriteriosRubrica2);
router.post("/criterios/crear", auth, onlyRoles(roles), rubricaController.crearCriterioRubrica);
router.put("/criterios/:id", auth, onlyRoles(roles), rubricaController.actualizarCriterioRubrica2);
router.delete("/criterios/:id", auth, onlyRoles(roles), rubricaController.eliminarCriterioRubrica);

router.get("/tipo_evaluacion/:id/options", auth, rubricaController.getTipoEvaluacionOptions);

module.exports = router;
