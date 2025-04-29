const { buildTempFilesPath, buildTemplatePath } = require("../utils/fileUtility");
const { GetByEvalTypeNotasService } = require("../services/notasService");
const db = require('../config/db');
const fs = require("fs-extra");
const { GetFullActaService } = require("./actaService");
const { GetTribunalMembersGradesService } = require("./tribunalMambersGradeService");
const { GetByIdTrabajoService } = require("./trabajoTitulacionService");
const { GetTribunalFromTesisFullDTO,  UngetTribunalFromTesisFullDTO } = require("../dto/tribunalMembersDTO");
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
                    <span class="estudiante-cedula">${estudiante.cedula??''}</span>
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
    // console.log("notasEstudiantesHtmlStr");
    // console.log(notasEstudiantesHtmlStr);
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
    // const membersHtmlStr = Object.values(data).map((item) => {
    //     item = normalizeFunc(item);
    //     return `
    //     <li>${item}</li>
    // `;
    // }).join("");
    const membersHtmlStr = `
        <li>${data.delegadoConsejoDirectivo}</li>
        <li>${data.docenteDeArea}</li>
        <li>${data.delegadoComisionCientifica}</li>
    `;
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

const buildHeadHtml = async (headHtmlContent, trabajoId) => {
    const thesisWorkRows = await GetByIdTrabajoService(trabajoId);
    if (!thesisWorkRows) {
        throw new Error("Trabajo not found");
    }
    const trabajoData = thesisWorkRows[0];
    // console.log("trabajoData");
    // console.log(trabajoData);
    const facultad = "FACULTAD DE CIENCIAS INFORMÁTICAS";
    const carrera = trabajoData.carrera;
    const nameStudentsList = trabajoData.estudiantes;
    const topicThesisWork = trabajoData.titulo;
    const dateThesisWorkAgreement = "Misssing, need be implemented in \"Registro Trabajo Final\" option dialog";
    const dateTimeThesisWorkDefense = trabajoData.fecha_defensa ?? "N/A";
    const nameTribunalMembers = GetTribunalFromTesisFullDTO(trabajoData);
    const excludesCapitalization = [
        "de", "la", "el", "los", "las", "un", "una", "unos", "unas", "en", "del"
    ];
    const normalizeText = (text) => {
        text = text.trim();
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

    const replaceHtml = (key, value, normalize = true) => headHtmlContent.replace("{{" + key + "}}", !normalize ? value : normalizeText(value));
    headHtmlContent = replaceHtml("facultad", facultad);
    headHtmlContent = replaceHtml("carrera", carrera);
    headHtmlContent = replaceHtml("nameStudentsList", buildStudentsFragmentHtml(nameStudentsList, normalizeText), false);
    headHtmlContent = replaceHtml("topicThesisWork", topicThesisWork);
    headHtmlContent = replaceHtml("dateThesisWorkAgreement", dateThesisWorkAgreement, false);
    // date and time, separated by comma, takes the first part (date)
    headHtmlContent = replaceHtml("dateTimeThesisWorkDefense", dateTimeThesisWorkDefense.split(",")[0], false);
    headHtmlContent = replaceHtml("nameTribunalMembers", buildTribunalMembersFragmentHtml(nameTribunalMembers, normalizeText), false);
    return [headHtmlContent, nameTribunalMembers];
}

const buildHeadTitleAndTableBaseHtml = (numColSpanTable, evalType, estudiante, headColNamesList) => {
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
    const ths = headColNamesList.map((item) => `<th>${item}</th>`).join("");
    const colspan = headColNamesList.length;
    return [
        `<h4 style="text-align: center;"> ${student}</h4>`
        , `
        <thead>
            <tr>
                <th colspan="${colspan}" style="text-align: center;">EVALUACIÓN ${evalTypeStr} DEL TRABAJO DE TITULACIÓN</th>
            </tr>
            <tr>
                ${ths}
            </tr>
        </thead>`,
        evalTypeStr
    ];
}

const buildTrsBodyTableHtmlAndMedianGrade = (headColNamesList, objEvaluation, tribunalMembers) => {
    const hasGradeComponentCategorys = headColNamesList.length > 5;
    const trs = [];
    const tds = [];
    if(hasGradeComponentCategorys){
        let firstrowspan = undefined;
        for (const [nameGradeComponentCategory, valueGradeComponentCategory] of Object.entries(objEvaluation)) {
            firstrowspan = Object.keys(valueGradeComponentCategory).length;
            tds.push(`<td rowspan="${firstrowspan}">${nameGradeComponentCategory}</td>`);
            for (const [nameEvaluation, valueEvaluation] of Object.entries(valueGradeComponentCategory)) {
                tds.push(`<td>${nameEvaluation}</td>`);
                tds.push(`<td>${JSON.stringify(valueEvaluation, null, 2)}</td>`);
            }
            trs.push(`<tr>${tds.join("")}</tr>`);
            // Clear the tds array
            tds.length = 0;
        }
        return trs.join("");
    } else {
        const notas = [];
        const notasBase = [];
        for (const [nameEvaluation, valueEvaluation] of Object.entries(objEvaluation)) {
            tds.push(`<td>${nameEvaluation}</td>`);
            tds.push(`<td>${valueEvaluation[0].base}</td>`);
            notasBase.push(parseInt(valueEvaluation[0].base));
            // for (const value of Object.values(valueEvaluation)) {
            //     notas.push(parseInt(value.nota));
            //     tds.push(`<td>${value.nota}</td>`);
            // }

            // delegadoConsejoDirectivo            
            const delegadoConsejoDirectivo = Object.values(valueEvaluation).find((value) => {
                return  value.docente===tribunalMembers.delegadoConsejoDirectivo
            });
            notas.push(parseInt(delegadoConsejoDirectivo.nota));
            tds.push(`<td>${delegadoConsejoDirectivo.nota}</td>`);
            // docenteDeArea
            const docenteDeArea = Object.values(valueEvaluation).find((value) => {
                return value.docente===tribunalMembers.docenteDeArea
            });
            console.log("docenteDeArea");
            console.log(docenteDeArea);
            notas.push(parseInt(docenteDeArea.nota));
            tds.push(`<td>${docenteDeArea.nota}</td>`);
            // delegadoComisionCientifica
            const delegadoComisionCientifica = Object.values(valueEvaluation).find((value) => {
                return value.docente===tribunalMembers.delegadoComisionCientifica
            });
            console.log("delegadoComisionCientifica");
            console.log(delegadoComisionCientifica);
            notas.push(parseInt(delegadoComisionCientifica.nota));
            tds.push(`<td>${delegadoComisionCientifica.nota}</td>`);
            
            // Concatenate the tds array into a single row (tr)
            trs.push(`<tr>${tds.join("")}</tr>`);
            // Clear the tds array
            tds.length = 0;
        }
        const notafinalsum = notas.reduce((acc, nota) => acc + nota, 0);
        const notafinalBase = notasBase.reduce((acc, nota) => acc + nota, 0);
        console.log("notafinalsum");
        console.log(notafinalsum);
        console.log("notafinalBase");
        console.log(notafinalBase);
        const numTribunalMembersGrades = 3;
        const notafinal = (notafinalsum / (notafinalBase * numTribunalMembersGrades))*100;
        return [trs.join(""), parseInt(notafinal+"")];
    }
}


const getTableBaseHtml = (numColSpanTable, evalType, estudiante, headColNamesList, value, tribunalMembers) => {
    const [title, head, evalTypeStr] = buildHeadTitleAndTableBaseHtml(numColSpanTable, evalType, estudiante, headColNamesList)
    const [trs, notafinal] = buildTrsBodyTableHtmlAndMedianGrade(headColNamesList, value, tribunalMembers);
    return `
        ${title}
        <table>
            ${head}
            <tbody>
                ${trs}
                <tr>
                    <td colspan="${numColSpanTable}">
                        <p style="text-align: center; font-weight: bold;">
                            CALIFICACIÓN FINAL ${evalTypeStr}: ( ${notafinal} / 100 )
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        `;
};

const buildTablesHtml = async (trabajoId, nameTribunalMembers) => {
    const tribunalMembersGrades = await GetTribunalMembersGradesService(trabajoId);
    const gradeComponentCategorys = [];
    const tribunalMembersGradesClean = tribunalMembersGrades.map((item) => {
        if (item.nombre.includes("::>")) {
            item.nombre = item.nombre.replace("::>", ": ");
            return item;
        }
        if (item.nombre.includes("<::>")) {
            const [gradeComponentCategory, gradeComponentDescription] = item.nombre.split("::>");
            item.nombre = gradeComponentCategory;
            item.gradeComponentCategory = gradeComponentDescription;
            gradeComponentCategorys.push(gradeComponentCategory);
        }
        return item;
    });
    const hasGradeComponentCategorys = gradeComponentCategorys.length > 0;
    console.log("tribunalMembersGradesClean");
    console.log(JSON.stringify(tribunalMembersGradesClean, null, 2));

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
    console.log("hasGradeComponentCategorys")
    console.log(hasGradeComponentCategorys)
    // console.log("newGroupedByStudents");
    // console.log(JSON.stringify(newGroupedByStudents, null, 2));
    const tables = [];
    let addedWriteenEvalType = false;
    for (const [studentName, strudentValue] of Object.entries(sortObjectEntries(newGroupedByStudents))) {
        for (const [kindEvaluation, kindEvaluationValue] of Object.entries(sortObjectEntries(strudentValue, "desc"))) {
            if (kindEvaluation === "INFORME FINAL" && addedWriteenEvalType) {
                continue;
            }
            if (kindEvaluation === "INFORME FINAL" && !addedWriteenEvalType) {
                addedWriteenEvalType = true;
                const table = getTableBaseHtml(numColSpanTable, kindEvaluation, "", headColNames, kindEvaluationValue, nameTribunalMembers);
                tables.push(table);
                continue;
            }
            const table = getTableBaseHtml(numColSpanTable, kindEvaluation, isOneStudent || kindEvaluation === "INFORME FINAL" ? "" : studentName, headColNames, kindEvaluationValue, nameTribunalMembers);
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
    const singBaseHtmlTemplatePath = buildTemplatePath("rubrica/template_sing_notas_base.html");
    const htmlTemplatePath = buildTemplatePath(dynamicData.nameTamplate + ".html");
    const hadHtmlContent = await fs.readFile(headHtmlTemplatePath, "utf-8");
    const tableBaseHtmlContent = await fs.readFile(tableBaseHtmlTemplatePath, "utf-8");
    const singBaseHtmlContent = await fs.readFile(singBaseHtmlTemplatePath, "utf-8");
    // const tableEscritoHtmlContent = await fs.readFile(tableEscritoHtmlTemplatePath, "utf-8");
    const tableDefensaHtmlContent = await fs.readFile(tableDefensaHtmlTemplatePath, "utf-8");
    let htmlContent = await fs.readFile(htmlTemplatePath, "utf-8");
    // const tempFilePath = buildTempFilesPath(dynamicData.tituloDocumentoActa + ".pdf");
    const tempHtmlPath = buildTempFilesPath(dynamicData.tituloDocumentoActa + ".html"); // Ruta para el archivo HTML temporal        
    htmlContent = htmlContent.replace("{{CONTENT}}", JSON.stringify(content, null, 2).replace("\n", "<br>"));
    const [headHtmlContent, nameTribunalMembers] = await buildHeadHtml(hadHtmlContent, trabajoId);
    htmlContent = htmlContent.replace("{{head}}", headHtmlContent);
    htmlContent =
        htmlContent
            .replace("{{tables}}", tableBaseHtmlContent)
            .replace("{{tables}}", await buildTablesHtml(trabajoId, UngetTribunalFromTesisFullDTO(nameTribunalMembers)))
            .replace("{{sings}}", singBaseHtmlContent);
    // Escribir el archivo HTML modificado en un archivo temporal
    await fs.writeFile(tempHtmlPath, htmlContent);
    return dynamicData.tituloDocumentoActa;
}
