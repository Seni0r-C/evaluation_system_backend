const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');

// 1. Reporte de estudiantes graduados en un rango de fechas
router.get('/graduados', reportesController.getGraduados);

// 2. Reporte de trabajos pendientes por estado
router.get('/trabajos-pendientes', reportesController.getTrabajosPendientes);

// 3. Reporte de calificaciones promedio por modalidad
router.get('/calificaciones-promedio', reportesController.getCalificacionesPromedio);

// 4. Reporte de carga de trabajo de docentes como tutores
router.get('/carga-tutores', reportesController.getCargaTutores);

// 5. Reporte de solicitudes de excepción
router.get('/solicitudes-excepcion', reportesController.getSolicitudesExcepcion);

// 6. Reporte de tendencias de rendimiento académico
router.get('/tendencias-rendimiento', reportesController.getTendenciasRendimiento);

module.exports = router;