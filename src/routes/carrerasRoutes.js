const express = require('express');
const router = express.Router();
const carreraController = require('../controllers/carrerasController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas de carrera
router.post('/crear', carreraController.createCarrera);
router.get('/listar', carreraController.getCarreras);
router.get('/listar/:id', carreraController.getCarreraById);
router.put('/actualizar/:id', carreraController.updateCarrera);
router.delete('/eliminar/:id', carreraController.deleteCarrera);

module.exports = router;