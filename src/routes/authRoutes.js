const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');

router.post("/login", authController.loginUser);
router.get('/me', verifyToken, authController.getAuthenticatedUser);

module.exports = router;