const express = require('express');
const router = express.Router();
const controller = require('../controllers/indexacionRevistaController');

router.get('/', controller.getAllIndexaciones); // Nuevo
router.post('/', controller.createIndexacion); // Nuevo
router.put('/:id', controller.updateIndexacion); // Nuevo
router.delete('/:id', controller.deleteIndexacion); // Nuevo

module.exports = router;
