
exports.getActa = async (req, res) => {
    try {
        return res.status(200).json({
            typeMsg: 'success',
            message: 'Acta generada mi pana :).',
            data: ["actita.pdf"]
        });
    } catch (error) {
        return res.status(400).json({
            typeMsg: 'error',
            message: 'Error en el servidor al obtener acta.',
            error: error
        });
    }
};