const { ensureFileExtension, buildTempFilesPath } = require('../utils/fileUtility');
const { GenerateByEvalTypeNotasDocService } = require('../services/notasDocService');
const fs = require('fs-extra');
// const path = require('path');
const puppeteer = require('puppeteer');


exports.getNotasFile = async (req, res) => {
    try {
        const fileName = req.params.file_name;
        // Ruta donde se encuentra el archivo
        const tempPdfFileName = ensureFileExtension(fileName, 'pdf');
        const tempPdfFilePath = buildTempFilesPath(tempPdfFileName);
        const tempHtmlFileName = ensureFileExtension(fileName, 'html');
        const tempHtmlPath = buildTempFilesPath(tempHtmlFileName);
        if (!fs.existsSync(tempHtmlPath)) {
            return res.status(404).json({
                typeMsg: 'error',
                message: 'Archivo de plantilla calificación no encontrado.',
                data: tempHtmlPath
            });
        }

        // Crear un navegador Puppeteer
        // const browser = await puppeteer.launch();
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        // Cargar el archivo HTML temporal con la ruta local
        await page.goto(`file://${tempHtmlPath}`, { waitUntil: "load" });

        // Generar el PDF
        await page.pdf({
            path: tempPdfFilePath,
            format: "A4",
            printBackground: true,
            omitBackground: false,
            displayHeaderFooter: false,  
            footerTemplate: '<div style="text-align: center;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>',
            headerTemplate: '<div style="text-align: center;">Header Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>',
            margin: {
                top: "60px",
                bottom: "60px",
                left: "40px",
                right: "40px",
            },
        });

        await browser.close();
        // res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
        // res.setHeader('Content-Type', 'application/pdf');
        // Enviar el PDF generado como descarga
        res.download(tempPdfFilePath, fileName, async (err) => {
            if (err) {
                console.error("Error enviando el PDF:", err);
                // res.status(400).json({
                res.json({
                    typeMsg: 'error',
                    message: 'Error en el servidor al descargar decumento de calificación.',
                    error: err
                });
            }

            // Eliminar el archivo temporal después de enviarlo
            await fs.remove(tempPdfFilePath);
            await fs.remove(tempHtmlPath); // Eliminar el archivo HTML temporal
            console.log("Archivos temporales eliminados");
        });
    } catch (error) {
        console.log('Error en el servidor al obtener acta.')
        console.log(error)
        // return res.status(400).json({
        return res.json({
            typeMsg: 'error',
            message: 'Error en el servidor al obtener acta.',
            error: error
        });
    }
};

// exports.getActaFile = async (req, res) => {
//     try {
//         const fileName = ensureFileExtension(req.params.file_name, 'pdf');
//         // Ruta donde se encuentra el archivo
//         const tempFilePath = buildDocPath(fileName);
//         // Verificamos si el archivo existe
//         if (!fs.existsSync(tempFilePath)) {
//             return res.status(404).json({
//                 typeMsg: 'error',
//                 message: 'Archivo no encontrado.',
//                 data: tempFilePath
//             });
//         }
//         // Configuramos las cabeceras para la descarga
//         res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
//         res.setHeader('Content-Type', 'application/pdf');
//         // Leemos y enviamos el archivo
//         const fileStream = fs.createReadStream(tempFilePath);                       
//         fileStream.pipe(res);
//     } catch (error) {
//         return res.status(400).json({
//             typeMsg: 'error',
//             message: 'Error en el servidor al obtener acta.',
//             error: error
//         });
//     }
// };

exports.getNotasFileName = async (req, res) => {
    try {
        const trabajoId = Number(req.params.trabajo_id);
        const evalTypeId = Number(req.params.eval_type_id);
        console.log(JSON.stringify({trabajoId, evalTypeId}))
        // Datos dinámicos que deseas reemplazar
        const fileName = await GenerateByEvalTypeNotasDocService(trabajoId, evalTypeId);
        
        res.json({ fileName });
    } catch (error) {
        return res.status(400).json({
            typeMsg: 'error',
            message: 'Error en el servidor al obtener nombre de documento de calificacion por tipo de evaluación.',
            error: error
        });
    }
};
