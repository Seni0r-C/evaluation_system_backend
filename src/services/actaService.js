const db = require('../config/db');
const { getServerDate, describirFecha, jsonDatetimeFromMysql } = require('../utils/dateUtility');
const { GetNombreUsuarioService } = require('./usuarioService');
const { GetByIdTrabajoService } = require('./trabajoTitulacionService');
const { asIngPhd } = require('../utils/strUtility');
const { GetTribunalFromTesisFullDTO } = require('../dto/tribunalMembersDTO');

// Servicio para obtener la última información del acta
exports.GetLastInfoActaService = async (trabajo_id, lugar) => {
    // First get row for current year
    const yearActual = new Date().getFullYear();
    let query = "SELECT * FROM acta WHERE year = ? ORDER BY id DESC LIMIT 1";
    const [rows] = await db.query(query, [yearActual]);
    let nextData = {};
    if (rows.length === 0) {
        // If there is no row for current year, get last year
        let query = "SELECT * FROM acta ORDER BY id DESC LIMIT 1";
        const [rowslastyear] = await db.query(query);
        // Prepare with same date, except year (set with current) and num_year_count(set to 1)
        nextData = {
            year: yearActual, num_year_count: 1,
            trabajo_id: trabajo_id,
            secretaria_id: rowslastyear.secretaria_id,
            vicedecano_id: rowslastyear.vicedecano_id,
            asesor_juridico_id: rowslastyear.asesor_juridico_id,
            fecha_hora: getServerDate(), ciudad: 'Portoviejo', lugar: lugar
        };
        return nextData;
    }
    const lastActa = rows[0];
    nextData = {
        year: yearActual, num_year_count: parseInt(lastActa.num_year_count) + 1,
        trabajo_id: trabajo_id,
        secretaria_id: lastActa.secretaria_id,
        vicedecano_id: lastActa.vicedecano_id,
        asesor_juridico_id: lastActa.asesor_juridico_id,
        fecha_hora: getServerDate(), ciudad: lastActa.ciudad, lugar: lugar || lastActa.lugar
    };
    return nextData;
};

// Servicio para registrar información en el acta
exports.InsertInfoActaService = async (data) => {
    const query = `
    INSERT INTO acta (
        year, num_year_count, secretaria_id, 
        vicedecano_id, asesor_juridico_id, fecha_hora, 
        ciudad, lugar, trabajo_id
        ) 
        VALUES (
        ?, ?, ?, 
        ?, ?, ?, 
        ?, ?, ?)
    `;
    const values = [data.year, data.num_year_count, data.secretaria_id, data.vicedecano_id, data.asesor_juridico_id, 
        data.fecha_hora, data.ciudad, data.lugar, data.trabajo_id];
    const [result] = await db.query(query, values);
    return { id: result.insertId, ...data };
};

exports.UpdateInfoActaService = async (data) => {
    const query = `
    UPDATE acta 
        SET num_year_count = ?, secretaria_id = ?, vicedecano_id = ?, asesor_juridico_id = ?, 
        fecha_hora = ?, ciudad = ?, lugar = ? 
        WHERE trabajo_id = ?
    `;
    const values = [
        data.num_year_count,
        data.secretaria_id, data.vicedecano_id, data.asesor_juridico_id, 
        data.fecha_hora, data.ciudad, data.lugar, data.trabajo_id, 
        // data.fecha_hora
    ];
    const [result] = await db.query(query, values);
    return { id: result.insertId, ...data };
};

// Servicio para obtener un acta por trabajo_id
exports.GetActaService = async (trabajo_id, lugar = null, ciudad="Portoviejo") => {
    const yearActual = new Date().getFullYear();
    const query = "SELECT * FROM acta WHERE trabajo_id = ? AND year = ?";
    const [rows] = await db.query(query, [trabajo_id, yearActual]);
    let acta = null;
    if (rows.length === 0) {
        acta = await this.GetLastInfoActaService(trabajo_id, lugar);
        await this.InsertInfoActaService(acta);
    } else {
        acta = rows[0];
        acta.fecha_hora = getServerDate();
        acta.lugar = lugar;
        acta.ciudad = ciudad;
        acta.num_year_count = acta.num_year_count??0;
        if(acta.num_year_count == 0){
            acta.num_year_count = parseInt(acta.num_year_count);
            acta.num_year_count++;
        }
        await this.UpdateInfoActaService(acta);
    }
    return acta;
};

const carreraMap = {
    "SISTEMAS DE INFORMACIÓN": {
        titulo: "INGENIERO(A) EN SISTEMAS DE INFORMACIÓN",
        modalidad: "PRESENCIAL",
        nivel: "TERCER NIVEL"
    },
    "INGENIERIA EN SISTEMAS INFORMATICOS": {
        titulo: "INGENIERO(A) EN SISTEMAS DE INFORMACIÓN",
        modalidad: "PRESENCIAL",
        nivel: "TERCER NIVEL"
    }
}

const getDefaultTitulo = (carreraName) => {
    carreraName = carreraName.toUpperCase();
    if (carreraName.startsWith("ING")) {
        const partsCarreraName = carreraName.split(" ");
        const titleCarrera = carreraName.replace(partsCarreraName[0], "").trim();
        return "INGENIERO(A) " + titleCarrera;
    }
    return "TITULO DE CARRERA SIN ESPECIFICAR";
};

exports.GetFullActaService = async (trabajo_id) => {
    const actaInfoFull = {};
    const actaInfo = await this.GetActaService(trabajo_id, "la sala de sesiones del H. Consejo Directivo");
    console.log(JSON.stringify(actaInfo, null, 2));    
    actaInfo.num_year_count = actaInfo.num_year_count + "";
    const numZeros = Math.abs(6 - actaInfo.num_year_count.length);
    actaInfo.num_year_count = actaInfo.num_year_count.padStart(numZeros, '0');
    // Datos del acta
    actaInfoFull.tituloActa = "ACTA DE DEFENSA DEL TRABAJO DE TITULACIÓN";
    actaInfoFull.numeroActa = `${actaInfo.year}–${actaInfo.num_year_count}`;
    actaInfoFull.ciudad = actaInfo?.ciudad;
    actaInfoFull.fechaHora = describirFecha(jsonDatetimeFromMysql(actaInfo.fecha_hora));
    actaInfoFull.facultad = actaInfo.facultad ?? "Facultad de Ciencias Informáticas";
    const vicedecano = await GetNombreUsuarioService(actaInfo.vicedecano_id);
    actaInfoFull.vicedecano = vicedecano ?? false ? asIngPhd(vicedecano) : "Ing. Christian Torres Morán, Mg.";

    actaInfoFull.lugar = actaInfo.lugar;
    actaInfoFull.secretarioAsesorJuridico = await GetNombreUsuarioService(actaInfo.asesor_juridico_id) ?? "Abg. Macías Cano David";
    // Información del acta obtenida desde la tesis
    const tesisData = await GetByIdTrabajoService(trabajo_id, true);
    const tribunal = GetTribunalFromTesisFullDTO(tesisData);
    actaInfoFull.delegadoComisionCientifica = tribunal.delegadoComisionCientifica;
    actaInfoFull.delegadoConsejoDirectivo = tribunal.delegadoConsejoDirectivo;
    actaInfoFull.docenteDeArea = tribunal.docenteDeArea;
    // Datos del trabajo de titulación y carrera
    actaInfoFull.modalidadTrabajoTitulacion = tesisData.modalidad?.toUpperCase();
    actaInfoFull.temaTrabajoTitulacion = tesisData.titulo?.toUpperCase();
    actaInfoFull.carrera = tesisData.carrera ?? "CARRERA SIN ESPECIFICAR";
    const carreraInfo = carreraMap[tesisData.carrera];
    actaInfoFull.tituloTrabajoTitulacion = carreraInfo?.titulo ?? getDefaultTitulo(tesisData.carrera);
    actaInfoFull.modalidadEstudioCarrera = carreraInfo?.modalidad ?? "PRESENCIAL";
    actaInfoFull.nivelTituloCarrera = carreraInfo?.nivel ?? "TERCER NIVEL";
    actaInfoFull.tutorTrabajoTitulacion = asIngPhd(tesisData.tutor) ?? "TUTOR SIN ESPECIFICAR";

    return actaInfoFull;
};
