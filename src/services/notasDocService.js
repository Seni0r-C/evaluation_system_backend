const { buildTempFilesPath, buildTemplatePath } = require("../utils/fileUtility");
const { GetByEvalTypeNotasService } = require("../services/notasService");
const db = require('../config/db');
const fs = require("fs-extra");
const { GetFullActaService } = require("./actaService");
const { GetTribunalMembersGradesService } = require("./tribunalMambersGradeService");
const { GetByIdTrabajoService } = require("./trabajoTitulacionService");
const { GetTribunalFromTesisFullDT0 } = require("../dto/tribunalMembersDTO");
const { groupsBy } = require("../utils/groupListUtility");
const { sortObjectEntries } = require("../utils/sortObjUtility");


function crearEstudianteNotas(estudiante, index = null) {
    const promedioTotal = estudiante.promedioTotal;
    const notasStr = estudiante.notas.map(nota => {
        let componentesStr = '';
        if (nota.componentes) {
            if (nota.componentes.nombre) {
                componentesStr += `
                    <span class="nextline estudiante-nota">
                        ${nota.componentes.nombre}
                        <span class="estudiante-nota-valor"></span>
                    </span>
                `
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
        notastudent.${index}
        <div class="acta-notas-section">
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
        </div>
    `;
}

const renderNotasEstudiantes = (estudiantes) => {
    const actaNotas = [];
    estudiantes.forEach((estudiante, index) => {
        // Obtener el contenedor donde se insertará el contenido
        const estudianteHTML = crearEstudianteNotas(estudiante, index);
        actaNotas.push(estudianteHTML);
    })
    actaNotas.push(`notastudent.${estudiantes.length}`);
    return actaNotas.join('');
}

const nombreEstudianteList = (estudiantes) => {
    return estudiantes.map(estudiante => estudiante.nombres);
}

const adjustPages = (notasEstudiantesHtmlStr, trabajoData, estudiantes, isComplexivo) => {

    const temaTesis = trabajoData?.temaTrabajoTitulacion?.split(" ");

    const nWordsTopicTesis = temaTesis?.length ?? 0;
    const marginTop = `<div style="margin-top: -15px;"></div>`;
    const marginBottom = `<div style="padding-bottom: 180px;"></div>`;
    const nextPage = `<div style="page-break-after: always;"></div>`;
    console.log("nWordsTopicTesis");
    console.log(nWordsTopicTesis);
    try {
        if (estudiantes.length == 1 && !isComplexivo) {
            notasEstudiantesHtmlStr = notasEstudiantesHtmlStr.replace("notastudent.0", "");
            notasEstudiantesHtmlStr = notasEstudiantesHtmlStr.replace("notastudent.1", nextPage);
            return notasEstudiantesHtmlStr;
        }
        if (estudiantes.length == 1 && isComplexivo) {
            notasEstudiantesHtmlStr = notasEstudiantesHtmlStr.replace("notastudent.0", marginTop);
            notasEstudiantesHtmlStr = notasEstudiantesHtmlStr.replace("notastudent.1", nextPage);
            return notasEstudiantesHtmlStr;
        }
        if (nWordsTopicTesis < 16) {
            notasEstudiantesHtmlStr = notasEstudiantesHtmlStr.replace("notastudent.0", "");
            notasEstudiantesHtmlStr = notasEstudiantesHtmlStr.replace("notastudent.1", "");
            notasEstudiantesHtmlStr = notasEstudiantesHtmlStr.replace("notastudent.2", nextPage);
        }
        else
            if (nWordsTopicTesis >= 16 && nWordsTopicTesis <= 26) {
                notasEstudiantesHtmlStr = notasEstudiantesHtmlStr.replace("notastudent.0", marginTop);
                notasEstudiantesHtmlStr = notasEstudiantesHtmlStr.replace("notastudent.1", "");
                notasEstudiantesHtmlStr = notasEstudiantesHtmlStr.replace("notastudent.2", nextPage + marginBottom);
            } else {
                notasEstudiantesHtmlStr = notasEstudiantesHtmlStr.replace("notastudent.0", nextPage);
                notasEstudiantesHtmlStr = notasEstudiantesHtmlStr.replace("notastudent.1", "");
                notasEstudiantesHtmlStr = notasEstudiantesHtmlStr.replace("notastudent.2", marginTop);
            }

    } catch (error) {
        console.log("buildDataActa error");
        console.log(error);
    }
    console.log("notasEstudiantesHtmlStr");
    console.log(notasEstudiantesHtmlStr);
    return notasEstudiantesHtmlStr;
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
    const renderSignatureStudent = (name) =>
        `<div class="label-signature-student acta-signature-estudiantes">
        ${name}
        <span class="dasheds"></span>
    </div>`;
    actaComplexivoData.actaSignatureEstudiantes = estudianteNombreList.map(renderSignatureStudent).join("");
    const notasEstudiantesHtmlStr = adjustPages(renderNotasEstudiantes(estudiantesNotasData), trabajoData, estudianteNombreList, isComplexivo);
    actaComplexivoData.notasEstudiantes = notasEstudiantesHtmlStr;

    // verbose data
    actaComplexivoData.preEstudiantes = estudianteNombreList.length > 1 ? "los estudiantes" : "el estudiante"; // Utiliza el plural si hay m?:,
    actaComplexivoData.pluralDo = estudianteNombreList.length > 1 ? "s" : ""; // Utiliza el plural cuando termina en do, por ejemplo mencionado, graduado
    actaComplexivoData.pluralA = estudianteNombreList.length > 1 ? "n" : ""; // Utiliza el plural cuando termina en a, por ejemplo exponga    
    actaComplexivoData.nameTamplate = nameTamplate;
    return actaComplexivoData;
}

/**
 * Given an object with tribunal members as values, returns a string with
 * a fragment of HTML that represents an ordered list of tribunal members.
 *
 * @param {object} data - An object with tribunal members as values.
 * @return {string} A string with a fragment of HTML that represents an ordered list of tribunal members.
 */
const buildTribunalMembersFragmentHtml = (data, normalizeFunc = (item) => item) => {
    const membersHtmlStr = Object.values(data).map((item) => {
        item = normalizeFunc(item);
        return `
        <li>${item}</li>
    `;
    }).join("");
    return `
        <ol>
            ${membersHtmlStr}
        </ol>
    `;
};

const buildStudentsFragmentHtml = (nameStudentsList, normalizeFunc) => {
    const membersHtmlStr = nameStudentsList.map((item) => {
        item = normalizeFunc(item);
        return `
        <li>${item}</li>
    `;
    }).join("");
    return `
        <ul>
            ${membersHtmlStr}
        </ul>
    `;
};

const buildHeadHtml = async (hadHtmlContent, trabajoId) => {
    const thesisWorkRows = await GetByIdTrabajoService(trabajoId);
    if (!thesisWorkRows) {
        throw new Error("Trabajo not found");
    }
    const trabajoData = thesisWorkRows[0];
    console.log("trabajoData");
    console.log(trabajoData);
    const facultad = "FACULTAD DE CIENCIAS INFORMÁTICAS";
    const carrera = trabajoData.carrera;
    const nameStudentsList = trabajoData.estudiantes;
    const topicThesisWork = trabajoData.titulo;
    const dateThesisWorkAgreement = "Misssing, need be implemented in \"Registro Trabajo Final\" option dialog";
    const dateTimeThesisWorkDefense = trabajoData.fecha_defensa ?? "N/A";
    const nameTribunalMembers = GetTribunalFromTesisFullDT0(trabajoData);
    const excludesCapitalization = [
        "de", "la", "el", "los", "las", "un", "una", "unos", "unas", "en", "del"
    ];
    const normalizeText = (text) => {
        text = text.trim();
        console.log("text");
        console.log(text);
        return text
            .split(' ') // Split the text into words
            .map(word => {
                if (excludesCapitalization.includes(word.toLowerCase())) {
                    return word.toLowerCase();
                }
                // Capitalize the first letter of each word and make the rest lowercase
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(' '); // Join the words back together with spaces
    };

    const replaceHtml = (key, value, normalize = true) => hadHtmlContent.replace("{{" + key + "}}", !normalize ? value : normalizeText(value));
    hadHtmlContent = replaceHtml("facultad", facultad);
    hadHtmlContent = replaceHtml("carrera", carrera);
    hadHtmlContent = replaceHtml("nameStudentsList", buildStudentsFragmentHtml(nameStudentsList, normalizeText), false);
    hadHtmlContent = replaceHtml("topicThesisWork", topicThesisWork);
    hadHtmlContent = replaceHtml("dateThesisWorkAgreement", dateThesisWorkAgreement, false);
    // date and time, separated by comma, takes the first part (date)
    hadHtmlContent = replaceHtml("dateTimeThesisWorkDefense", dateTimeThesisWorkDefense.split(",")[0], false);
    hadHtmlContent = replaceHtml("nameTribunalMembers", buildTribunalMembersFragmentHtml(nameTribunalMembers, normalizeText), false);
    return hadHtmlContent;
}

const getTableBaseHtml = (numColSpanTable, evalType, estudiante, headColNamesList, value) => {
    let rowspan = 1;
    const buildStringWithArticle = (inputString) => {
        // List of feminine singular words (common ones), you can expand this list as needed
        const feminineWords = ["a", "ad"];

        // Trim and normalize the input string
        inputString = inputString.trim().toLowerCase();
        inps = inputString.split(" ");
        inputString = inps[0];

        // Check if the word is feminine or masculine
        const isFeminine = feminineWords.some(word => inputString.endsWith(word));

        // Determine the article based on gender
        let article = isFeminine ? "DE LA" : "DEL";

        // Return the full string with the article
        return `${article} ${inputString.toUpperCase()}`;
    };
    const student = estudiante ? "(" + estudiante + ")" : "";
    const evalTypeStr = buildStringWithArticle(evalType);
    return `
        <h4 style="text-align: center;"> ${student}</h4>
        <table>
            <thead>
                <tr>
                    <!-- <th colspan="9"><h2 style="text-align: center;"></h2></th> -->
                    <th colspan="6" style="text-align: center;">EVALUACIÓN ${evalTypeStr} DEL TRABAJO DE TITULACIÓN</th>
                </tr>
                <tr>
                    <th rowspan="2">COMPONENTES A EVALUAR</th>
                    <th rowspan="2">PARÁMETROS A CALIFICAR</th>
                    <th rowspan="2">NOTA MÁXIMA DE REFERENCIA</th>
                    <th>TRIBUNAL 1</th>
                    <th>TRIBUNAL 2</th>
                    <th>TRIBUNAL 3</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td rowspan="2">CONTENIDO</td>
                    <td class="left-align">Calidad de la exposición de la sustentación tomando en cuenta la organización y
                        contenido.</td>
                    <td>30</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td class="left-align">Dominio demostrado en el tema y sobre otros aspectos de la especialidad.</td>
                    <td>20</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td rowspan="2">PRESENTACIÓN</td>
                    <td class="left-align">Elaboración y uso de la ayuda de equipos en apoyo de la disertación.</td>
                    <td>10</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td class="left-align">Manejo de la presentación y dominio del auditorio.</td>
                    <td>10</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>DISCUSIÓN</td>
                    <td class="left-align">Contenido y coherencia de las respuestas y explicaciones sustentadas ante las
                        inquietudes del tribunal.</td>
                        <td>30</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr class="total">
                        <td colspan="2">TOTAL</td>
                        <td>100</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="6">
                            <p style="text-align: center; font-weight: bold;">
                                CALIFICACIÓN FINAL ${evalTypeStr}: ( _____ / 100 )
                            </p>
                        </td>
                    </tr>
            </tbody>
        </table>
        `
};

const buildTablesHtml = async (trabajoId) => {
    const tribunalMembersGrades = await GetTribunalMembersGradesService(trabajoId);
    const gradeComponentCategorys = [];
    const tribunalMembersGradesClean = tribunalMembersGrades.map((item) => {
        if (item.nombre.includes("::>")) {
            const [gradeComponentCategory, gradeComponentDescription] = item.nombre.split("::>");
            item.nombre = gradeComponentCategory;
            item.gradeComponentCategory = gradeComponentDescription;
            gradeComponentCategorys.push(gradeComponentCategory);
        }
        return item;
    });
    const hasGradeComponentCategorys = gradeComponentCategorys.length > 0;
    console.log(tribunalMembersGradesClean);

    let numColSpanTable = 5;
    let defaultRowSpan = 1;
    let headColNames = [
        "PARÁMETROS A CALIFICAR",
        "NOTA MÁXIMA DE REFERENCIA",
        "TRIBUNAL 1", "TRIBUNAL 2", "TRIBUNAL 3"
    ];
    let groupRoute = "estudiante.tipo_evaluacion.nombre";
    if (hasGradeComponentCategorys) {
        groupRoute = "estudiante.tipo_evaluacion.gradeComponentCategory.nombre";
        headColNames = ["COMPONENTES A EVALUAR", ...headColNames];
    }
    const newGroupedByStudents = groupsBy(tribunalMembersGradesClean, groupRoute);
    const isOneStudent = newGroupedByStudents.length === 1;
    console.log("newGroupedByStudents");
    console.log(JSON.stringify(newGroupedByStudents, null, 2));
    const tables = [];
    let addedWriteenEvalType = false;
    for (const [studentName, strudentValue] of Object.entries(sortObjectEntries(newGroupedByStudents))) {
        for (const [kindEvaluation, kindEvaluationValue] of Object.entries(sortObjectEntries(strudentValue, "desc"))) {
            if (kindEvaluation === "INFORME FINAL" && addedWriteenEvalType) {
                continue;
            }
            if (kindEvaluation === "INFORME FINAL" && !addedWriteenEvalType) {
                addedWriteenEvalType = true;
                const table = getTableBaseHtml(numColSpanTable, kindEvaluation, "", headColNames, kindEvaluationValue);
                tables.push(table);
                continue;
            }
            const table = getTableBaseHtml(numColSpanTable, kindEvaluation, isOneStudent || kindEvaluation === "INFORME FINAL" ? "" : studentName, headColNames, kindEvaluationValue);
            tables.push(table);
        }
    }
    return tables.join("");
}


exports.GenerateByEvalTypeNotasDocService = async (trabajoId, evalTypeId) => {
    const dynamicData = {
        nameTamplate: "template_notas",
        // nameTamplate: "template_notas_defensa",
        // nameTamplate: "template_notas_head",
        tituloDocumentoActa: "Notas de estudiantes",
        notasEstudiantes: "NOTAS-ESTUDIANTES",
    };

    const content = await GetByEvalTypeNotasService(trabajoId, evalTypeId);

    const headHtmlTemplatePath = buildTemplatePath("rubrica/template_notas_head.html");
    const tableDefensaHtmlTemplatePath = buildTemplatePath("rubrica/template_notas_defensa.html");
    // const tableEscritoHtmlTemplatePath = buildTemplatePath("rubrica/template_notas_escrito.html");
    const tableBaseHtmlTemplatePath = buildTemplatePath("rubrica/template_notas_base.html");
    const htmlTemplatePath = buildTemplatePath(dynamicData.nameTamplate + ".html");
    const hadHtmlContent = await fs.readFile(headHtmlTemplatePath, "utf-8");
    const tableBaseHtmlContent = await fs.readFile(tableBaseHtmlTemplatePath, "utf-8");
    // const tableEscritoHtmlContent = await fs.readFile(tableEscritoHtmlTemplatePath, "utf-8");
    const tableDefensaHtmlContent = await fs.readFile(tableDefensaHtmlTemplatePath, "utf-8");
    let htmlContent = await fs.readFile(htmlTemplatePath, "utf-8");
    // const tempFilePath = buildTempFilesPath(dynamicData.tituloDocumentoActa + ".pdf");
    const tempHtmlPath = buildTempFilesPath(dynamicData.tituloDocumentoActa + ".html"); // Ruta para el archivo HTML temporal        
    htmlContent = htmlContent.replace("{{CONTENT}}", JSON.stringify(content, null, 2).replace("\n", "<br>"));
    htmlContent = htmlContent.replace("{{head}}", await buildHeadHtml(hadHtmlContent, trabajoId));
    htmlContent =
        htmlContent
            .replace("{{tables}}", tableBaseHtmlContent)
            .replace("{{tables}}", await buildTablesHtml(trabajoId));
    // Escribir el archivo HTML modificado en un archivo temporal
    await fs.writeFile(tempHtmlPath, htmlContent);
    return dynamicData.tituloDocumentoActa;
}
