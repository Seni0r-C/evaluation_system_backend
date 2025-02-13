const { buildTempFilesPath, buildTemplatePath } = require("../utils/fileUtility");
const { GetNotasService } = require("../services/notasService");
const db = require('../config/db');
const fs = require("fs-extra");
const { GetFullActaService } = require("./actaService");


function crearEstudianteNotas(estudiante) {
    const promedioTotal = estudiante.promedioTotal;
    const notasStr = estudiante.notas.map(nota => {
        let componentesStr = '';
        if (nota.componentes) {
            if (nota.componentes.nombre) {
                componentesStr += `
                    <span class="nextline estudiante-nota">
                        ${nota.componentes.nombre}
                        <span class="estudiante-nota-valor"></span>
                    </span>`
            }
            componentesStr += nota.componentes.listado.map(nota => {
                return `
                <span class="nextline estudiante-nota-componente">
                    ${nota.nombre}
                    <span class="estudiante-nota-valor">${nota.valor}/${nota.base}</span>
                </span>
                `
            }).join('');
        }
        return `
        ${componentesStr}
        <span class="nextline estudiante-nota">
            ${nota.nombre}
            <span class="estudiante-nota-valor">${nota.valor}/${nota.base}</span>
        </span>`;
    }
    ).join('');
    return `
        <div class="estudiante-notas">
                <span class="nextline estudiante-nombre">
                    ${estudiante.nombres}
                    <span class="estudiante-cedula">${estudiante.cedula}</span>
                </span>
                ${notasStr}
                <span class="nextline estudiante-nota">
                    ${promedioTotal.nombre}
                    <span class="dots"></span>
                    <span class="estudiante-nota-valor">${promedioTotal.valor}/${promedioTotal.base}</span>
                </span>
        </div>
    `;
}

const renderNotasEstudiantes = (estudiantes) => {
    const actaNotas = [];
    estudiantes.forEach(estudiante => {
        // Obtener el contenedor donde se insertará el contenido
        const estudianteHTML = crearEstudianteNotas(estudiante);
        actaNotas.push(estudianteHTML);
    })
    return actaNotas.join('');
}

const getEstudiantesNotas = async (trabajoData) => {
    try {
        const estudianteIds = trabajoData.estudiantes;
        const nameFile = buildTempFilesPath('notasData.json')
        // Leer el archivo JSON
        const data = await fs.readFile(nameFile, 'utf8');
        // Parsear el contenido como JSON
        return JSON.parse(data).filter(estudiante => estudianteIds.includes(estudiante.id));
    } catch (error) {
        console.error('Error al leer el archivo:', error);
        return null;
    }
};

const getTrabajo = async (id) => {
    try {
        const nameFile = buildTempFilesPath('trabajosData.json')
        // Leer el archivo JSON
        const data = await fs.readFile(nameFile, 'utf8');
        // Parsear el contenido como JSON
        return JSON.parse(data).find(trabajo => trabajo.id === id);
    } catch (error) {
        console.error('Error al leer el archivo:', error);
        return null;
    }
};

const nombreEstudianteList = (estudiantes) => {
    return estudiantes.map(estudiante => estudiante.nombres);
}

const buildDataActaComplexivo = async (estudiantesNotasData, trabajoData) => {
    const actaComplexivoData = {};
    const estudianteNombreList = nombreEstudianteList(estudiantesNotasData);
    actaComplexivoData.modalidadTrabajoTitulacion = trabajoData.modalidadTrabajoTitulacion?.trim()?.toUpperCase();
    actaComplexivoData.lugar = trabajoData.lugar ?? "la sala de sesiones del H. Consejo Directivo";
    actaComplexivoData.tituloDocumentoActa = trabajoData.numeroActa + "- " + estudianteNombreList.join(" Y ");
    actaComplexivoData.estudiantes = estudianteNombreList.join(", ");

    const modalidadComplexivoAliasList = ["EXAMEN COMPLEXIVO", "EXÁMEN COMPLEXIVO"];
    const isComplexivo = modalidadComplexivoAliasList.some(item => item === actaComplexivoData.modalidadTrabajoTitulacion);
    actaComplexivoData.tribunalTipo = isComplexivo ? "Tribunal de recepción del Examen Complexivo" : "Tribunal de Sustentación de Trabajo de Titulación";
    const nameTamplate = isComplexivo ? "template_complexivo" : "template_tesis";

    // Signature data section
    // actaComplexivoData.secretariaNombre = "Elizabeth";
    actaComplexivoData.secretariaNombre = "";
    const renderSignatureStudent = (name)=>
    `<div class="label-signature-student acta-signature-estudiantes">
        ${name}
        <span class="dasheds"></span>
    </div>`;
    actaComplexivoData.actaSignatureEstudiantes = estudianteNombreList.map(renderSignatureStudent).join("");
    const notasEstudiantesHtmlStr = renderNotasEstudiantes(estudiantesNotasData);
    actaComplexivoData.notasEstudiantes = notasEstudiantesHtmlStr;

    // verbose data
    actaComplexivoData.preEstudiantes = estudianteNombreList.length > 1 ? "los estudiantes" : "el estudiante"; // Utiliza el plural si hay m?:,
    actaComplexivoData.pluralDo = estudianteNombreList.length > 1 ? "s" : ""; // Utiliza el plural cuando termina en do, por ejemplo mencionado, graduado
    actaComplexivoData.pluralA = estudianteNombreList.length > 1 ? "n" : ""; // Utiliza el plural cuando termina en a, por ejemplo exponga    
    actaComplexivoData.nameTamplate = nameTamplate;
    return actaComplexivoData;
}

exports.GenerateActaService = async (trabajoId) => {
    // const trabajoData = await getTrabajo(trabajoId);
    const trabajoData = await GetFullActaService(trabajoId);
    console.log("GenerateActaService");	
    console.log({trabajoId});	
    
    // const trabajoData = await GetNotasService(trabajoId);
    console.log({trabajoData});	
    // console.debug("-----------------------------trabajoData-----------------------------")
    // console.debug(trabajoData)
    // const estudiantesNotasData = await getEstudiantesNotas(trabajoData);
    const estudiantesNotasData = await GetNotasService(trabajoId);
    const actaComplexivoData = await buildDataActaComplexivo(estudiantesNotasData, trabajoData);
    // console.debug("-----------------------------actaComplexivoData-----------------------------")
    // console.debug(actaComplexivoData)
    const dynamicData = { ...trabajoData, ...actaComplexivoData };
    
    const htmlTemplatePath = buildTemplatePath(dynamicData.nameTamplate + ".html");
    let htmlContent = await fs.readFile(htmlTemplatePath, "utf-8");
    // const tempFilePath = buildTempFilesPath(dynamicData.tituloDocumentoActa + ".pdf");
    const tempHtmlPath = buildTempFilesPath(dynamicData.tituloDocumentoActa + ".html"); // Ruta para el archivo HTML temporal        
    // htmlContent = htmlContent.replace("<!--NOTAS-ESTUDIANTES-->", notasEstudiantesHtmlStr);
    // Reemplazar las partes dinámicas con los datos
    Object.keys(dynamicData).forEach((key) => {
        const regex = new RegExp(`{{${key}}}`, "g"); // Busca la variable con {{variable}}
        htmlContent = htmlContent.replace(regex, dynamicData[key]);
    });
    console.debug(dynamicData)

    // Escribir el archivo HTML modificado en un archivo temporal
    await fs.writeFile(tempHtmlPath, htmlContent);
    return dynamicData.tituloDocumentoActa;
}