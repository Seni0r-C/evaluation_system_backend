const express = require('express');
const router = express.Router();
const actaDocController = require('../controllers/actaDocController');
const actaController = require('../controllers/actaController');

router.get('/pdf/:file_name', actaDocController.getActaFile);   
router.get('/pdf-name/:id_trabajo', actaDocController.getActaFileName);   

router.get('/notas-scheme/:trabajo_modalidad_id', actaController.getNotasSchemeActa);
router.get('/last-info', actaController.getLastInfoActa);
router.post('/info', actaController.postInfoActa);
router.get('/:trabajo_id', actaController.getActa);
router.get('/full/:trabajo_id', actaController.getActaFull);

module.exports = router;
