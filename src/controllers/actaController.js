const { ensureFileExtension, buildTempFilesPath } = require('../utils/fileUtility');
const { GenerateActaService } = require('../services/actaService');
const fs = require('fs-extra');
const path = require('path');
const puppeteer = require('puppeteer');


exports.getActaFile = async (req, res) => {
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
                message: 'Archivo de plantilla acta no encontrado.',
                data: tempHtmlPath
            });
        }

        // Crear un navegador Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Cargar el archivo HTML temporal con la ruta local
        await page.goto(`file://${tempHtmlPath}`, { waitUntil: "load" });

        // Generar el PDF
        await page.pdf({
            path: tempPdfFilePath,
            format: "A4",
            printBackground: true,
        });

        await browser.close();

        // Enviar el PDF generado como descarga
        res.download(tempPdfFilePath, fileName, async (err) => {
            if (err) {
                console.error("Error enviando el PDF:", err);
                res.status(400).json({
                    typeMsg: 'error',
                    message: 'Error en el servidor al descargar acta.',
                    error: err
                });
            }

            // Eliminar el archivo temporal después de enviarlo
            await fs.remove(tempPdfFilePath);
            await fs.remove(tempHtmlPath); // Eliminar el archivo HTML temporal
            console.log("Archivos temporales eliminados");
        });
    } catch (error) {
        return res.status(400).json({
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

exports.getActaFileName = async (req, res) => {
    try {
        const trabajoId = Number(req.params.id_trabajo);
        // Datos dinámicos que deseas reemplazar
        const fileName = await GenerateActaService(trabajoId);

        res.json({ fileName });
    } catch (error) {
        return res.status(400).json({
            typeMsg: 'error',
            message: 'Error en el servidor al obtener nombre de acta.',
            error: error
        });
    }
};
