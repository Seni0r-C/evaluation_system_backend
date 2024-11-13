const db = require('../config/db');

exports.getUserByCorreo = (email) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuario WHERE Email = ?', [email], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};