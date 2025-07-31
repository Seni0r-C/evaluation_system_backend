require('dotenv').config();

// SERVIDOR
exports.PORT = process.env.PORT ?? 3000;
exports.FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

// BASE DE DATOS
exports.DB_HOST = process.env.DB_HOST ?? 'localhost';
exports.DB_USER = process.env.DB_USER ?? 'root';
exports.DB_PASSWORD = process.env.DB_PASSWORD ?? '';
exports.DB_NAME = process.env.DB_NAME ?? 'gestion_titulacion';

// SEGURIDAD
exports.JWT_SECRET = process.env.JWT_SECRET ?? 'secret';
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1h';

// API EXTERNA
exports.FAKE_AUTH = process.env.FAKE_AUTH ?? 'true';
exports.UTM_API_KEY = process.env.UTM_API_KEY ?? '';