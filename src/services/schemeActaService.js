const db = require('../config/db');

// Servicio para obtener el esquema de notas con nombres en lugar de IDs
exports.GetNotasSchemeActaService = async (trabajo_modalidad_id) => {
    const query = `
        SELECT ans.id, 
               ste.nombre AS comp_nombre, 
               parent_ste.nombre AS comp_parent_nombre, 
               smt.nombre AS trabajo_modalidad_nombre
        FROM acta_notas_scheme ans
        LEFT JOIN sistema_tipo_evaluacion ste ON ans.comp_id = ste.id
        LEFT JOIN sistema_tipo_evaluacion parent_ste ON ans.comp_parent_id = parent_ste.id
        LEFT JOIN sistema_modalidad_titulacion smt ON ans.trabajo_modalidad_id = smt.id
        WHERE ans.trabajo_modalidad_id = ?`;

    const [rows] = await db.query(query, [trabajo_modalidad_id]);
    return rows;
};