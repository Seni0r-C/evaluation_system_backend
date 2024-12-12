const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// Ruta de login con validación
router.post("/login", authController.loginUser);
router.post('/register', authController.registerUser);
// router.get('/me', authController.getAuthenticatedUser);
router.post('/reset-password', authController.restablecerPassword);

module.exports = router;

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión en el sistema
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 example: "usuario@example.com"
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Acceso exitoso"
 *                 datos:
 *                   type: string
 *                   description: Token de autenticación
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       400:
 *         description: Usuario o contraseña incorrectos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del usuario
 *                 example: "Juan"
 *               apellido:
 *                 type: string
 *                 description: Apellido del usuario
 *                 example: "Pérez"
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 example: "usuario@example.com"
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: "123456"
 *               id_rol:
 *                 type: integer
 *                 description: ID del rol asignado al usuario
 *                 example: 1
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Usuario registrado exitosamente"
 *                 datos:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: "Juan"
 *                     apellido:
 *                       type: string
 *                       example: "Pérez"
 *                     email:
 *                       type: string
 *                       example: "usuario@example.com"
 *                     id_rol:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Correo ya registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: "El correo ya está registrado"
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Restablece la contraseña de un usuario
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 example: "usuario@example.com"
 *               password:
 *                 type: string
 *                 description: Nueva contraseña
 *                 example: "nueva_contraseña123"
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Contraseña cambiada exitosamente"
 *       400:
 *         description: Usuario no encontrado o error al cambiar la contraseña
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       500:
 *         description: Error del servidor
 */