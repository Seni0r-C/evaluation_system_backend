exports.formatDateSelector = (fechaStr) => {
    try {
        let formattedStr;

        if (fechaStr.includes(", ")) {
            // Formato "DD/MM/YYYY, HH:mm"
            const [datePart, timePart] = fechaStr.split(", ");
            if (!datePart || !timePart) {
                throw new Error("Formato de fecha incorrecto.");
            }

            const [day, month, year] = datePart.split("/");
            const [hour, minute] = timePart.split(":");

            if (!day || !month || !year || !hour || !minute) {
                throw new Error("Partes de la fecha o hora faltantes.");
            }

            // Validar fecha
            const formattedDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
            if (isNaN(formattedDate.getTime())) {
                throw new Error("Fecha inválida.");
            }

            // Formatear como YYYY-MM-DD HH:mm:ss
            formattedStr = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`;

        } else if (fechaStr.includes("T")) {
            // Formato "YYYY-MM-DDTHH:mm"
            const [datePart, timePart] = fechaStr.split("T");
            if (!datePart || !timePart) {
                throw new Error("Formato de fecha incorrecto.");
            }

            const [year, month, day] = datePart.split("-");
            const [hour, minute] = timePart.split(":");

            if (!year || !month || !day || !hour || !minute) {
                throw new Error("Partes de la fecha o hora faltantes.");
            }

            // Validar fecha
            const formattedDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
            if (isNaN(formattedDate.getTime())) {
                throw new Error("Fecha inválida.");
            }

            // Formatear como YYYY-MM-DD HH:mm:ss
            formattedStr = `${year}-${month}-${day} ${hour}:${minute}:00`;

        } else {
            throw new Error("Formato de fecha no reconocido.");
        }

        return formattedStr;
    } catch (error) {
        console.error("Error al formatear la fecha:", error.message);
        return null;
    }
};


/**
 * Converts a Date object to a localized string representation.
 *
 * @param {Date} date - The date to be converted.
 * @returns {string} A string representing the date and time in the format "dd/mm/yyyy, hh:mm",
 *                   localized to the 'es-EC' locale and 'America/Guayaquil' timezone.
 */

exports.parseToLocale = (date) => {
    if (!date) {
        throw new Error("The date parameter is required.");
    }
    if (date instanceof String) {
        date = new Date(date);
    }
    return date.toLocaleString('es-EC', {
        timeZone: 'America/Guayaquil',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23' // Forzar formato de 24 horas
    });
};


exports.formatDatetimeMysql = (date) => {
    try {
        console.log("formatDatetimeMysql");
        console.log(date);
        const parts = date.split(",");
        const dateParts = parts[0].trim().split("/");
        const day = dateParts[0];
        const month = dateParts[1];
        const year = dateParts[2];
        const time = parts[1].trim();
        return `${year}-${month}-${day} ${time}:00`;
    } catch (Exception) {
        console.log(Exception);
        return '';
    }
};

exports.jsonDatetimeFromServerDate = (fechaStr) => {
    const [datePart, timePart] = fechaStr.split(", ");
    const [day, month, year] = datePart.split("/").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);
    return { day, month, year, hour, minute };
}

exports.jsonDatetimeFromMysql = (fechaStr) => {
    const [datePart, timePart] = fechaStr.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);
    return { day, month, year, hour, minute, second };
}

exports.getServerDate = (mysqlFormat = true) => {
    const date = this.parseToLocale(new Date());
    return mysqlFormat ? this.formatDatetimeMysql(date) : date;
};

const numerosTexto = {
    0: "cero", 1: "uno", 2: "dos", 3: "tres", 4: "cuatro", 5: "cinco", 6: "seis", 7: "siete", 8: "ocho", 9: "nueve",
    10: "diez", 11: "once", 12: "doce", 13: "trece", 14: "catorce", 15: "quince", 16: "dieciséis", 17: "diecisiete",
    18: "dieciocho", 19: "diecinueve", 20: "veinte", 21: "veintiuno", 22: "veintidós", 23: "veintitrés", 24: "veinticuatro",
    25: "veinticinco", 26: "veintiséis", 27: "veintisiete", 28: "veintiocho", 29: "veintinueve",
    30: "treinta", 31: "treinta y uno"
};

const mesesTexto = {
    1: "enero", 2: "febrero", 3: "marzo", 4: "abril", 5: "mayo", 6: "junio", 7: "julio", 8: "agosto",
    9: "septiembre", 10: "octubre", 11: "noviembre", 12: "diciembre"
};

const convertirNumeroATexto = (numero) => {
    if (numero in numerosTexto) {
        return numerosTexto[numero];
    }

    const unidades = numero % 10;
    const decenas = Math.floor(numero / 10) * 10;

    return `${numerosTexto[decenas]} y ${numerosTexto[unidades]}`;
};

const convertirAnioATexto = (anio) => {
    const miles = Math.floor(anio / 1000) * 1000;
    const centenas = anio % 1000;

    return `dos mil ${centenas ? convertirNumeroATexto(centenas) : ""}`.trim();
};

exports.describirFecha = (dateObject, incluirMinutos = false) => {
    try {
        const { day, month, year, hour, minute } = dateObject;

        if (!day || !month || !year || hour === undefined || minute === undefined) {
            throw new Error("Formato de fecha incorrecto.");
        }

        const diaTexto = convertirNumeroATexto(day);
        const mesTexto = mesesTexto[month];
        const anioTexto = convertirAnioATexto(year);
        const horaTexto = convertirNumeroATexto(hour);
        const minutosTexto = incluirMinutos ? ` con ${convertirNumeroATexto(minute)} minutos` : "";

        return `a los ${diaTexto} días del mes de ${mesTexto} del año ${anioTexto}, a las ${horaTexto} horas${minutosTexto}`;
    } catch (error) {
        console.error("Error al formatear la fecha:", error.message);
        return null;
    }
};
