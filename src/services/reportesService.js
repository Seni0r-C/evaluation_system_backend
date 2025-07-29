const excel = require('exceljs');

async function crearExcel(data, columns, title) {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet(title);

    // Agregar título
    worksheet.addRow([title]).font = { bold: true, size: 16 };
    worksheet.mergeCells('A1', `${String.fromCharCode(64 + columns.length)}1`);
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.addRow([]);

    // Agregar cabeceras
    worksheet.getRow(3).values = columns.map(col => col.header);
    worksheet.getRow(3).font = { bold: true };

    // Agregar datos
    data.forEach(row => {
        const rowData = columns.map(col => row[col.key]);
        worksheet.addRow(rowData);
    });

    // Ajustar ancho de columnas
    worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, cell => {
            const columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength) {
                maxLength = columnLength;
            }
        });
        column.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    return await workbook.xlsx.writeBuffer();
}

module.exports = {
    crearExcel
};