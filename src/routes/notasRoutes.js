const express = require('express');
const router = express.Router();
const notasController = require('../controllers/notasController');

router.get('/:trabajo_id', notasController.getNotas);   

module.exports = router;
