const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Obtener el token del encabezado Authorization
    const token = authHeader && authHeader.split(' ')[1]; // Formato esperado: "Bearer <token>"

    if (!token) {
        return res.status(403).json({ mensaje: 'Acceso denegado. No se encontró el token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token con la clave secreta
        req.user = decoded; // Almacenar los datos decodificados en la solicitud
        next(); // Continuar con la siguiente función middleware
    } catch (err) {
        res.status(401).json({ mensaje: 'Token no válido' });
    }
};

module.exports = verifyToken;
