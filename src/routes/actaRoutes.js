const express = require('express');
const router = express.Router();
const actaController = require('../controllers/actaController');

router.get('/', actaController.getActas);   

module.exports = router;
