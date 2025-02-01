const { buildDocPath } = require('../utils/constantes');
const fs = require('fs');
const path = require('path');

exports.getActa = async (req, res) => {
    try {
        // Ruta donde se encuentra el archivo
        const filePath = buildDocPath('actita.pdf');
        
        // Verificamos si el archivo existe
        if (fs.existsSync(filePath)) {
            // Configuramos las cabeceras para la descarga
            res.setHeader('Content-Disposition', 'attachment; filename=actita.pdf');
            res.setHeader('Content-Type', 'application/pdf');

            // Leemos y enviamos el archivo
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } else {
            return res.status(404).json({
                typeMsg: 'error',
                message: 'Archivo no encontrado.',
                data: filePath
            });
        }
    } catch (error) {
        return res.status(400).json({
            typeMsg: 'error',
            message: 'Error en el servidor al obtener acta.',
            error: error
        });
    }
};
