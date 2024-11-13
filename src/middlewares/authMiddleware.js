const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt; // obtener el token de la cookie

    if (!token) {
        return res.status(403).json({ mensaje: 'Acceso denegado. No se encontró el token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ mensaje: 'Token no válido' });
    }
};

module.exports = verifyToken;