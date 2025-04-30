const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');

router.post("/login", authController.loginUser);
router.get('/info', auth, authController.getUserInfo);

module.exports = router;