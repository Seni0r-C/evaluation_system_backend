const express = require('express');
const router = express.Router();
const actaController = require('../controllers/actaController');

router.get('/pdf/:file_name', actaController.getActaFile);   
router.get('/pdf-name/:id_trabajo', actaController.getActaFileName);   

module.exports = router;
