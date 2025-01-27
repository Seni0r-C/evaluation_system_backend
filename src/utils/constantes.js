const { utmAuth } = require("../services/authService");

// Simulamos un conjunto de usuarios con sus contraseñas
const usuariosSimulados = {
    'vicedecano': {
        nombres: 'KATTY GARCIA BARREIRO VERA',
        tipo_usuario: 'VICEDECANO',
        idpersonal: 12342,
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
        idpersonal: 19360,
        datos_estudio: JSON.stringify([
            { carrera: 'Ingenieria En Sistemas Informaticos', facultad: 'CIENCIAS INFORMÁTICAS' }
        ])
    }
    // Otros usuarios pueden ser añadidos aquí para la simulación
};

// La función `truchaAuth` emula una llamada a la API externa
const truchaAuth = async ({ usuario, clave }) => {
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

exports.externalAuth = async function (body, truchaMode = false) {
    if (truchaMode) {
        return await truchaAuth(body);
    }
    return await utmAuth(body);
}