require('dotenv').config();

exports.PORT = process.env.PORT;
exports.FRONT_URL = process.env.FRONT_URL??"http://localhost:5173/";
