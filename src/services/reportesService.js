const excel = require('exceljs');

async function crearExcel(data, columns, title) {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet(title);

    // Estilos base
    const titleStyle = {
        font: { bold: true, size: 16, color: { argb: 'FF000000' } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } }
    };

    const headerStyle = {
        font: { bold: true, color: { argb: 'FFFFFFFF' } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } },
        border: {
            top: { style: 'thin' }, bottom: { style: 'thin' },
            left: { style: 'thin' }, right: { style: 'thin' }
        }
    };

    const dataStyle = {
        alignment: { vertical: 'middle', horizontal: 'left' },
        border: {
            top: { style: 'thin' }, bottom: { style: 'thin' },
            left: { style: 'thin' }, right: { style: 'thin' }
        }
    };

    // Agregar título
    const titleRow = worksheet.addRow([title]);
    titleRow.height = 25;
    worksheet.mergeCells(`A1:${String.fromCharCode(64 + columns.length)}1`);
    const cellTitle = worksheet.getCell('A1');
    Object.assign(cellTitle, titleStyle);

    // Fila vacía
    worksheet.addRow([]);

    // Agregar cabeceras
    const headerRow = worksheet.addRow(columns.map(col => col.header));
    headerRow.height = 20;
    headerRow.eachCell(cell => Object.assign(cell, headerStyle));

    // Agregar datos
    data.forEach(row => {
        const rowData = columns.map(col => row[col.key]);
        const newRow = worksheet.addRow(rowData);
        newRow.eachCell(cell => Object.assign(cell, dataStyle));
    });

    // Ajustar ancho de columnas
    worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, cell => {
            const columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength) maxLength = columnLength;
        });
        column.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    // Congelar encabezado
    worksheet.views = [{ state: 'frozen', ySplit: 3 }];

    return await workbook.xlsx.writeBuffer();
}

module.exports = {
    crearExcel
};