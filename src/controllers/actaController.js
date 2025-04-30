const { GetNotasSchemeActaService } = require('../services/schemeActaService');
const { GetLastInfoActaService, GetActaService, GetFullActaService } = require('../services/actaService');

// Controladores
exports.getNotasSchemeActa = async (req, res) => {
    try {
        const { trabajo_modalidad_id } = req.params;
        const data = await GetNotasSchemeActaService(trabajo_modalidad_id);
        res.status(200).json(data);
    } catch (error) {
        const msg = { msgType: "error", message: 'Error al obtener el esquema de notas', error }
        console.log(msg)
        res.status(200).json(msg);
    }
};

exports.getLastInfoActa = async (req, res) => {
    try {
        const data = await GetLastInfoActaService();
        res.status(200).json(data);
    } catch (error) {
        const msg = { msgType: "error", message: 'Error al obtener la última información del acta', error }
        console.log(msg)
        res.status(200).json(msg);
    }
};

// exports.postInfoActa = async (req, res) => {
//     try {
//         const data = req.body;
//         const result = await PostInfoActaService(data);
//         res.status(201).json(result);
//     } catch (error) {
//         const msg = { msgType: "error", message: 'Error al registrar la información del acta', error }
//         console.log(msg)
//         res.status(200).json(msg);
//     }
// };

exports.getActa = async (req, res) => {
    try {
        const { trabajo_id } = req.params;
        const data = await GetActaService(trabajo_id);
        res.status(200).json(data);
    } catch (error) {
        const msg = { msgType: "error", message: 'Error al obtener el acta', error }
        console.log(msg)
        res.status(200).json(msg);
    }
};

exports.getActaFull = async (req, res) => {
    try {
        const { trabajo_id } = req.params;
        const data = await GetFullActaService(trabajo_id);
        res.status(200).json(data);
    } catch (error) {
        const msg = { msgType: "error", message: 'Error al obtener datos completos del acta', error }
        console.log(msg)
        res.status(200).json(msg);
    }
};
