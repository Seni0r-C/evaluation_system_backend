require('dotenv').config();

exports.PORT = process.env.PORT ?? 3000;
exports.FRONT_URL = process.env.FRONT_URL ?? "http://localhost:5173";
