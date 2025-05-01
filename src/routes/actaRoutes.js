const express = require('express');
const router = express.Router();
const actaDocController = require('../controllers/actaDocController');
const actaController = require('../controllers/actaController');
const auth = require('../middlewares/authMiddleware');

router.get('/pdf/:file_name', auth, actaDocController.getActaFile);
router.get('/pdf-name/:id_trabajo', auth, actaDocController.getActaFileName);

router.get('/notas-scheme/:trabajo_modalidad_id', auth, actaController.getNotasSchemeActa);
router.get('/last-info', auth, actaController.getLastInfoActa);
// router.post('/info', actaController.postInfoActa); //PostInfoActaService no existe por eso la comenté
router.get('/:trabajo_id', auth, actaController.getActa);
router.get('/full/:trabajo_id', auth, actaController.getActaFull);

module.exports = router;
