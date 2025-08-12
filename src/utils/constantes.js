const { FAKE_AUTH, ADMIN_PASSWORD, ADMIN_USERNAME } = require("../config/env");
const { utmAuth } = require("../services/authService");
const https = require('https');
const db = require('../config/db');

// La función `fakeAuth` emula una llamada a la API externa
const fakeAuth = async ({ usuario, clave }) => {
    if (clave !== ADMIN_PASSWORD) {
        throw new Error('Contraseña incorrecta');
    }

    // Verificamos si el usuario existe en la base de datos
    const [existingUser] = await db.query(
        "SELECT * FROM usuario WHERE usuario = ?",
        [usuario]
    );

    // Si el usuario no existe, lanzamos un error
    if (existingUser.length === 0) {
        throw new Error('Usuario no encontrado');
    }

    return {
        cedula: existingUser[0].cedula,
        nombres: existingUser[0].nombre,
        idpersonal: existingUser[0].id_personal,
    };
};

const agent = new https.Agent({
    rejectUnauthorized: false
});

exports.externalAuth = async function (body, res) {
    let is_fake_auth;
    const user = body.usuario;

    try {
        is_fake_auth = JSON.parse(FAKE_AUTH.toLowerCase());
    } catch (error) {
        is_fake_auth = true; // Valor por defecto si el parsing falla
    }

    // Verifica que sea estrictamente un booleano (true o false)
    if (typeof is_fake_auth !== 'boolean') {
        throw new Error('FAKE_AUTH debe ser un booleano (true/false)');
    }

    if (is_fake_auth || user === ADMIN_USERNAME) {
        return await fakeAuth(body);
    }
    return await utmAuth(body, agent, res);
}

// Definición de colores para la consola
exports.LogColors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    Fg: {
        Black: "\x1b[30m",
        Red: "\x1b[31m",
        Green: "\x1b[32m",
        Yellow: "\x1b[33m",
        Blue: "\x1b[34m",
        Magenta: "\x1b[35m",
        Cyan: "\x1b[36m",
        White: "\x1b[37m"
    },

    Bg: {
        Black: "\x1b[40m",
        Red: "\x1b[41m",
        Green: "\x1b[42m",
        Yellow: "\x1b[43m",
        Blue: "\x1b[44m",
        Magenta: "\x1b[45m",
        Cyan: "\x1b[46m",
        White: "\x1b[47m"
    }
};

exports.getCurrentTime = () => {
    return new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
};