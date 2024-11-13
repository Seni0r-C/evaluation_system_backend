// src/utils/errorHandler.js
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);  // Mostrar el error en la consola
    res.status(500).json({
        exito: false,
        mensaje: 'Algo salió mal.',
        error: err.message || err,
    });
};
