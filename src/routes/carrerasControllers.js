const express = require('express');
const router = express.Router();
const carreraController = require('../controllers/carrerasController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas de carrera
router.get('/get',authMiddleware, carreraController.getCarreras);
router.post('/crear', carreraController.createCarrera);
router.put('/get/:id', carreraController.updateCarrera);
router.delete('/delete/:id', carreraController.deleteCarrera);

module.exports = router;