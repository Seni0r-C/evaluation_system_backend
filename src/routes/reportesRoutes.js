const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');
const auth = require('../middlewares/authMiddleware');

// 1. Reporte de estudiantes graduados en un rango de fechas
router.get('/graduados', auth, reportesController.getGraduados);

// 2. Reporte de trabajos pendientes por estado
router.get('/trabajos-pendientes', auth, reportesController.getTrabajosPendientes);

// 3. Reporte de calificaciones promedio por modalidad
router.get('/calificaciones-promedio', auth, reportesController.getCalificacionesPromedio);

// 4. Reporte de carga de trabajo de docentes como tutores
router.get('/carga-tutores', auth, reportesController.getCargaTutores);

// 5. Reporte de solicitudes de excepción
router.get('/solicitudes-excepcion', auth, reportesController.getSolicitudesExcepcion);

// 6. Reporte de tendencias de rendimiento académico
router.get('/tendencias-rendimiento', auth, reportesController.getTendenciasRendimiento);

module.exports = router;