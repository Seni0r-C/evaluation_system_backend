const { FAKE_AUTH } = require("../config/env");
const { utmAuth } = require("../services/authService");
const https = require('https');

// Simulamos un conjunto de usuarios con sus contraseñas
//LA VERDAD NOS E SI ESTO FUNCIONE CORRECTAMENTE  :) pero es loq ue esatba antes xd
const usuariosSimulados = {
    'vicedecano': {
        nombres: 'KATTY GARCIA BARREIRO VERA',
        tipo_usuario: 'VICEDECANATO',
        idpersonal: 12342,
        datos_estudio: JSON.stringify([
            { carrera: 'Ingenieria En Sistemas Informaticos', facultad: 'CIENCIAS INFORMÁTICAS' }
        ])
    },
    'preside': {
        nombres: 'HAROLD OMAR GARCIA VILLANUEVA',
        tipo_usuario: 'DOCENTE',
        idpersonal: 12382,
        datos_estudio: JSON.stringify([
            { carrera: 'Ingenieria En Sistemas Informaticos', facultad: 'CIENCIAS INFORMÁTICAS' }
        ])
    },
    'tribunal': {
        nombres: 'PEDRO MANOLO ANESTECIO ONETWO',
        tipo_usuario: 'DOCENTE',
        idpersonal: 12351,
        datos_estudio: JSON.stringify([
            { carrera: 'Ingenieria En Sistemas Informaticos', facultad: 'CIENCIAS INFORMÁTICAS' }
        ])
    },
    // Estudiantes
    'pupilo': {
        nombres: 'SANTIAGO SEGUNDO PACHECO VEREDICTO',
        tipo_usuario: 'ESTUDIANTE',
        idpersonal: 34351,
        datos_estudio: JSON.stringify([
            { carrera: 'Ingenieria En Sistemas Informaticos', facultad: 'CIENCIAS INFORMÁTICAS' }
        ])
    },
    'alumno': {
        nombres: 'JAIME ENRIQUYE ALMIGUEZ GONZALEZ',
        tipo_usuario: 'ESTUDIANTE',
        idpersonal: 19359,
        datos_estudio: JSON.stringify([
            { carrera: 'Ingenieria En Sistemas Informaticos', facultad: 'CIENCIAS INFORMÁTICAS' }
        ])
    },
    'alumna': {
        nombres: 'AGUINALDA GUISELLE VALIVIEZO JILIWE',
        tipo_usuario: 'ESTUDIANTE',
        idpersonal: 19355,
        datos_estudio: JSON.stringify([
            { carrera: 'Ingenieria En Sistemas Informaticos', facultad: 'CIENCIAS INFORMÁTICAS' }
        ])
    },
    // Tutores
    'estudiante': {
        nombres: 'TAMIÑAWI SUMI SUMIWKA MANIKO',
        tipo_usuario: 'DOCENTE',
        idpersonal: 19351,
        datos_estudio: JSON.stringify([
            { carrera: 'Ingenieria En Sistemas Informaticos', facultad: 'CIENCIAS INFORMÁTICAS' }
        ])
    },
    'tutor': {
        nombres: 'CARLOS MANICHO VENEZUELO MANGIZO',
        tipo_usuario: 'ESTUDIANTE',
        idpersonal: 56709,
        datos_estudio: JSON.stringify([
            { carrera: 'Ingenieria En Sistemas Informaticos', facultad: 'CIENCIAS INFORMÁTICAS' }
        ])
    },
    'tutora': {
        nombres: 'ANA GABRIELA YUKATAN SLOVAKY',
        tipo_usuario: 'DOCENTE',
        idpersonal: 22360,
        datos_estudio: JSON.stringify([
            { carrera: 'Ingenieria En Sistemas Informaticos', facultad: 'CIENCIAS INFORMÁTICAS' }
        ])
    },
    'admin': {
        nombres: 'VERGAS ANTONIO RESABALA CHICUNGUNYIA',
        tipo_usuario: 'ADMINISTRACIÓN',
        idpersonal: 15390,
        datos_estudio: JSON.stringify([
            { carrera: 'Ingenieria En Sistemas Informaticos', facultad: 'CIENCIAS INFORMÁTICAS' }
        ])
    },
    'manicho': {
        nombres: 'MANITA RESABALA DECHAR CALABASA',
        tipo_usuario: 'ADMINISTRACIÓN',
        idpersonal: 15620,
        datos_estudio: JSON.stringify([
            { carrera: 'Ingenieria En Sistemas Informaticos', facultad: 'CIENCIAS INFORMÁTICAS' }
        ])
    },
    'juan': {
        nombres: 'JUAN FERNANDO VERLASQUEZ SANTOS',
        tipo_usuario: 'DOCENTE',
        idpersonal: 456567,
        datos_estudio: JSON.stringify([
            { carrera: 'Ingenieria En Sistemas Informaticos', facultad: 'CIENCIAS INFORMÁTICAS' }
        ])
    },
    'clara.mendez': {
        nombres: 'CLARA BONELLA DIMATRIZ CUZCO',
        tipo_usuario: 'DOCENTE',
        idpersonal: 412147,
        datos_estudio: JSON.stringify([
            { carrera: 'Ingenieria En Sistemas Informaticos', facultad: 'CIENCIAS INFORMÁTICAS' }
        ])
    },
    'carteaga7126': {
        nombres: 'ARTEAGA TORO CARLOS LUIS',
        tipo_usuario: 'DOCENTE',
        idpersonal: 412147,
        datos_estudio: JSON.stringify([
            { carrera: 'Ingenieria En Sistemas Informaticos', facultad: 'CIENCIAS INFORMÁTICAS' }
        ])
    },
    // Otros usuarios pueden ser añadidos aquí para la simulación
};

// La función `fakeAuth` emula una llamada a la API externa
const fakeAuth = async ({ usuario, clave }) => {
    // Simulamos un retraso en la respuesta como si fuera una llamada externa
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verificamos que el usuario exista y que la contraseña sea la correcta
    if (usuariosSimulados[usuario] && clave === '123') {
        // Si existe el usuario y la contraseña es correcta, devolvemos los datos del usuario
        return usuariosSimulados[usuario];
    } else {
        // Si no, lanzamos un error indicando que el usuario o la contraseña son incorrectos
        throw new Error('Usuario o contraseña incorrectos');
    }
};

const agent = new https.Agent({
    rejectUnauthorized: false
});

exports.externalAuth = async function (body, res) {
    let is_fake_auth;

    try {
        is_fake_auth = JSON.parse(FAKE_AUTH.toLowerCase());
    } catch (error) {
        is_fake_auth = true; // Valor por defecto si el parsing falla
    }

    // Verifica que sea estrictamente un booleano (true o false)
    if (typeof is_fake_auth !== 'boolean') {
        throw new Error('FAKE_AUTH debe ser un booleano (true/false)');
    }

    if (is_fake_auth) {
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