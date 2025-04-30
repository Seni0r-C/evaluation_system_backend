const express = require('express');
const router = express.Router();
const controller = require('../controllers/indexacionRevistaController');
const auth = require('../middlewares/authMiddleware');
const onlyRoles = require('../middlewares/onlyTypeOfUsers');
const roles = [1, 10, 11];

router.get('/', auth, controller.getAllIndexaciones); // Nuevo
router.post('/', auth, onlyRoles(roles), controller.createIndexacion); // Nuevo
router.put('/:id', auth, onlyRoles(roles), controller.updateIndexacion); // Nuevo
router.delete('/:id', auth, onlyRoles(roles), controller.deleteIndexacion); // Nuevo

module.exports = router;
