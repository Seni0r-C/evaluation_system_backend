const constantes = require('../utils/constantes.js');
const LogColors = constantes.LogColors;

const logger = (req, res, next) => {
    const timestamp = constantes.getCurrentTime();
    const methodColors = {
        'GET': LogColors.Fg.Green,
        'POST': LogColors.Fg.Blue,
        'PUT': LogColors.Fg.Yellow,
        'DELETE': LogColors.Fg.Red,
        'PATCH': LogColors.Fg.Magenta
    };

    console.log(`${LogColors.Dim}[${timestamp}]${LogColors.Reset} ${methodColors[req.method] || LogColors.Fg.Cyan}${req.method.padEnd(7)}${LogColors.Reset} ${req.url}`);

    if (Object.keys(req.headers).length > 0) {
        console.log(`${LogColors.Fg.Cyan}↳ Headers:${LogColors.Reset}`, JSON.stringify(req.headers, null, 2));
    }
    if (Object.keys(req.body).length > 0) {
        console.log(`${LogColors.Fg.Cyan}↳ Body:${LogColors.Reset}`, JSON.stringify(req.body, null, 2));
    }
    if (Object.keys(req.query).length > 0) {
        console.log(`${LogColors.Fg.Cyan}↳ Query:${LogColors.Reset}`, JSON.stringify(req.query, null, 2));
    }
    if (Object.keys(req.params).length > 0) {
        console.log(`${LogColors.Fg.Cyan}↳ Params:${LogColors.Reset}`, JSON.stringify(req.params, null, 2));
    }

    next();
};

module.exports = logger;