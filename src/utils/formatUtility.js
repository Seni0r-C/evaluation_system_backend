exports.formatFechaDefensa = (fechaStr) => {
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
