const express = require('express');
const router = express.Router();
const FacultadController = require('../controllers/facultadController');

// Rutas de carrera
router.get('/get', FacultadController.getFacultades);
router.post('/crear', FacultadController.createFacultad);
router.put('/get/:id', FacultadController.updateFacultad);
router.delete('/delete/:id', FacultadController.deleteFacultad);

module.exports = router;