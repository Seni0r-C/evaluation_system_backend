const db = require('../config/db');
const { getServerDate, describirFecha } = require('../utils/dateUtility');
const { GetNombreUsuarioService } = require('./usuarioService');
const { GetByIdTrabajoService } = require('./trabajoTitulacionService');
const { asIngPhd } = require('../utils/strUtility');
const { GetTribunalFromTesisFullDTO: GetTribunalFromTesisFullDTO } = require('../dto/tribunalMembersDTO');

// Servicio para obtener la última información del acta
exports.GetLastInfoActaService = async () => {
    const yearActual = new Date().getFullYear();
    let query = "SELECT * FROM acta WHERE year = ? ORDER BY id DESC LIMIT 1";
    const [rows] = await db.query(query, [yearActual]);
    let nextData = {};
    if (rows.length === 0) {
        let query = "SELECT * FROM acta ORDER BY id DESC LIMIT 1";
        const [rowslastyear] = await db.query(query);
        nextData = {
            year: yearActual, num_year_count: 1,
            trabajo_id: null, 
            secretaria_id: rowslastyear.secretaria_id, 
            vicedecano_id: rowslastyear.vicedecano_id, 
            asesor_juridico_id: rowslastyear.asesor_juridico_id,
            fecha_hora: getServerDate(), ciudad: 'Portoviejo', lugar: null
        };
        await this.PostInfoActaService(nextData);
        return nextData;
    }
    const lastActa = rows[0];
    nextData = {
        year: yearActual, num_year_count: lastActa.num_year_count + 1,
        trabajo_id: null,
        secretaria_id: lastActa.secretaria_id,
        vicedecano_id: lastActa.vicedecano_id,
        asesor_juridico_id: lastActa.asesor_juridico_id,
        fecha_hora: getServerDate(), ciudad: lastActa.ciudad, lugar: lastActa.lugar
    };
    await db.query("UPDATE acta SET num_year_count = ? WHERE id = ?", [nextData.num_year_count, lastActa.id]);
    return nextData;
};

// Servicio para registrar información en el acta
exports.PostInfoActaService = async (data) => {
    const query = "INSERT INTO acta (year, num_year_count, secretaria_id, vicedecano_id, asesor_juridico_id, fecha_hora_verbose, ciudad, lugar, trabajo_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [data.year, data.num_year_count, data.secretaria_id, data.vicedecano_id, data.asesor_juridico_id, data.fecha_hora_verbose, data.ciudad, data.lugar, data.trabajo_id];
    const [result] = await db.query(query, values);
    return { id: result.insertId, ...data };
};

// Servicio para obtener un acta por trabajo_id
exports.GetActaService = async (trabajo_id) => {
    const query = "SELECT * FROM acta WHERE trabajo_id = ?";
    const [rows] = await db.query(query, [trabajo_id]);
    if (rows.length === 0) {

        return rows[0];
    }
    
    return rows.length > 0 ? rows[0] : this.GetLastInfoActaService();
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
    const actaInfo = await this.GetActaService(trabajo_id);
    actaInfo.num_year_count = actaInfo.num_year_count+"";
    const numZeros = Math.abs(6 - actaInfo.num_year_count.length);
    actaInfo.num_year_count = actaInfo.num_year_count.padStart(numZeros, '0');
    // Datos del acta
    actaInfoFull.tituloActa = "ACTA DE DEFENSA DEL TRABAJO DE TITULACIÓN";
    actaInfoFull.numeroActa = `${actaInfo.num_year_count}–${actaInfo.year}`;
    actaInfoFull.ciudad = actaInfo.ciudad;
    actaInfoFull.fechaHora = describirFecha(actaInfo.fecha_hora);
    actaInfoFull.facultad = actaInfo.facultad ?? "Facultad de Ciencias Informáticas";
    const vicedecano = await GetNombreUsuarioService(actaInfo.vicedecano_id);
    actaInfoFull.vicedecano =  vicedecano??false ? asIngPhd(vicedecano): "Ing. Loor Zamora Patricio, Mg.";

    actaInfoFull.lugar = actaInfo.lugar ?? "la sala de sesiones del H. Consejo Directivo";
    actaInfoFull.secretarioAsesorJuridico = await GetNombreUsuarioService(actaInfo.asesor_juridico_id) ?? "Abg. Macías Cano David";
    // Información del acta obtenida desde la tesis
    const tesisData = await GetByIdTrabajoService(trabajo_id, true);
    console.log("tesisData");
    console.log(tesisData);
    const tribunal = GetTribunalFromTesisFullDTO(tesisData);
    actaInfoFull.delegadoComisionCientifica = tribunal.delegadoComisionCientifica;
    actaInfoFull.delegadoConsejoDirectivo = tribunal.delegadoConsejoDirectivo;
    actaInfoFull.docenteDeArea = tribunal.docenteDeArea;
    // Datos del trabajo de titulación y carrera
    actaInfoFull.modalidadTrabajoTitulacion = tesisData.modalidad?.toUpperCase();
    const isComplexivo = actaInfoFull.modalidadTrabajoTitulacion === "EXAMEN COMPLEXIVO" ||
        actaInfoFull.modalidadTrabajoTitulacion === "EXÁMEN COMPLEXIVO";
    actaInfoFull.temaTrabajoTitulacion = isComplexivo ? null : tesisData.titulo?.toUpperCase();
    actaInfoFull.carrera = tesisData.carrera ?? "CARRERA SIN ESPECIFICAR";
    const carreraInfo = carreraMap[tesisData.carrera];
    actaInfoFull.tituloTrabajoTitulacion = carreraInfo?.titulo ?? getDefaultTitulo(tesisData.carrera);
    actaInfoFull.modalidadEstudioCarrera = carreraInfo?.modalidad ?? "PRESENCIAL";
    actaInfoFull.nivelTituloCarrera = carreraInfo?.nivel ?? "TERCER NIVEL";
    actaInfoFull.tutorTrabajoTitulacion = asIngPhd(tesisData.tutor) ?? "TUTOR SIN ESPECIFICAR";

    return actaInfoFull;
};
