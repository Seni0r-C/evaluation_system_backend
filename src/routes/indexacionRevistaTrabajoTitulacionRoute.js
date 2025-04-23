// routes/indexacionRevistaRoute.js
const express = require('express');
const router = express.Router();
const indexacionController = require('../controllers/indexacionRevistaTrabajoTitulacionController');

router.get('/:id_trabajo', indexacionController.getIndexacionByTrabajo);
router.post('/', indexacionController.asignarIndexacion);

module.exports = router;
