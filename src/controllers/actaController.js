const db = require('../config/db');
const {GetNotasTrabajoService} = require('../services/trabajoTitulacionService');
const {GetNotasSchemeActaService} = require('../services/schemeActaService');
// Servicio para obtener el esquema de notas
// const GetNotasSchemeActaService = async (trabajo_modalidad_id) => {
//     const query = "SELECT id, comp_id, comp_parent_id, trabajo_modalidad_id FROM acta_notas_scheme WHERE trabajo_modalidad_id = ?";
//     const [rows] = await db.query(query, [trabajo_modalidad_id]);
//     return rows;
// };



// Servicio para obtener la última información del acta
const GetLastInfoActaService = async () => {
    const yearActual = new Date().getFullYear();
    let query = "SELECT * FROM acta ORDER BY id DESC LIMIT 1";
    const [rows] = await db.query(query);

    if (rows.length === 0) {
        return { id: null, year: yearActual, num_year_count: 1, trabajo_id: null, secretaria_id: null, vicedecano_id: null, asesor_juridico_id: null, fecha_hora_verbose: null, ciudad_id: 'Portoviejo', lugar: null };
    }
    if (rows[0].year !== yearActual) {
        rows[0].year = yearActual;
    }
    return rows[0];
};

// Servicio para registrar información en el acta
const PostInfoActaService = async (data) => {
    const query = "INSERT INTO acta (year, num_year_count, secretaria_id, vicedecano_id, asesor_juridico_id, fecha_hora_verbose, ciudad, lugar, trabajo_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [data.year, data.num_year_count, data.secretaria_id, data.vicedecano_id, data.asesor_juridico_id, data.fecha_hora_verbose, data.ciudad, data.lugar, data.trabajo_id];
    const [result] = await db.query(query, values);
    return { id: result.insertId, ...data };
};

// Servicio para obtener un acta por trabajo_id
const GetActaService = async (trabajo_id) => {
    const query = "SELECT * FROM acta WHERE trabajo_id = ?";
    const [rows] = await db.query(query, [trabajo_id]);
    return rows.length > 0 ? rows[0] : null;
};

// Controladores
exports.getNotasSchemeActa = async (req, res) => {
    try {
        const { trabajo_modalidad_id } = req.params;
        const data = await GetNotasSchemeActaService(trabajo_modalidad_id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el esquema de notas', details: error });
    }
};

exports.getLastInfoActa = async (req, res) => {
    try {
        const data = await GetLastInfoActaService();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la última información del acta', details: error });
    }
};

exports.postInfoActa = async (req, res) => {
    try {
        const data = req.body;
        const result = await PostInfoActaService(data);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar la información del acta', details: error });
    }
};

exports.getActa = async (req, res) => {
    try {
        const { trabajo_id } = req.params;
        const data = await GetActaService(trabajo_id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el acta', details: error });
    }
};
