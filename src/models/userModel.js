const db = require('../config/db');

exports.getUserByCedula = (cedula) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuario WHERE usuario = ?', [cedula], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

exports.getEmployeeByCedula = (cedula) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT id_empleado FROM empleado WHERE cedula = ?', [cedula], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

exports.createUser = (id_empleado, cedula, password) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO usuario (id_empleado, usuario, password_hash) VALUES (?, ?, ?)',
            [id_empleado, cedula, password],
            (err) => {
                if (err) reject(err);
                resolve();
            }
        );
    });
};
