const express = require('express');
const router = express.Router();
const notasController = require('../controllers/notasController');
const notasDocController = require('../controllers/notasDocController');
const auth = require('../middlewares/authMiddleware');

router.get('/:trabajo_id', auth, notasController.getNotas);
router.get('/pdf-name/:trabajo_id/:eval_type_id', notasDocController.getNotasFileName);
router.get('/pdf/:file_name', notasDocController.getNotasFile);

module.exports = router;
