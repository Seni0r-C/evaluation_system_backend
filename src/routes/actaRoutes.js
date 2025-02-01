const express = require('express');
const router = express.Router();
const actaController = require('../controllers/actaController');

router.get('/pdf/:id_trabajo', actaController.getActa);   

module.exports = router;
