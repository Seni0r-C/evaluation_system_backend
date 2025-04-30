const express = require('express');
const router = express.Router();
const carreraController = require('../controllers/carrerasController');
const auth = require('../middlewares/authMiddleware');
const onlyRoles = require('../middlewares/onlyTypeOfUsers');
const roles = [1, 10, 11, 12];
// Rutas de carrera
router.post('/crear', auth, onlyRoles(roles), carreraController.createCarrera);
router.get('/listar', auth, carreraController.getCarreras);
router.get('/listar/:id', auth, carreraController.getCarreraById);
router.put('/actualizar/:id', auth, onlyRoles(roles), carreraController.updateCarrera);
router.delete('/eliminar/:id', auth, onlyRoles(roles), carreraController.deleteCarrera);

module.exports = router;