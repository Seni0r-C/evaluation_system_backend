const mysql = require('mysql2');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require('./env.js');

const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
});

// Cada vez que se crea una nueva conexión en el pool
pool.on('connection', (connection) => {
    connection.query(
        "SET SESSION sql_mode = REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', '')",
        (err) => {
            if (err) {
                console.error('Error al desactivar ONLY_FULL_GROUP_BY:', err);
            } else {
                console.log('ONLY_FULL_GROUP_BY desactivado para esta conexión');
            }
        }
    );
});

module.exports = pool.promise();