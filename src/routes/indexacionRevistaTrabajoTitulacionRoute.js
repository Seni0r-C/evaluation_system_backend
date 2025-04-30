// routes/indexacionRevistaRoute.js
const express = require('express');
const router = express.Router();
const indexacionController = require('../controllers/indexacionRevistaTrabajoTitulacionController');
const auth = require('../middlewares/authMiddleware');
const onlyRoles = require('../middlewares/onlyTypeOfUsers');
const roles = [1, 10, 11];

router.get('/:id_trabajo', auth, indexacionController.getIndexacionByTrabajo);
router.post('/', auth, onlyRoles(roles), indexacionController.asignarIndexacion);

module.exports = router;
