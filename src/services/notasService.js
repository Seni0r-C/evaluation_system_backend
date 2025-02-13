const { GetNotasTrabajoService, GetModalidadTrabajoService } = require('../services/trabajoTitulacionService');
const { GetNotasSchemeActaService } = require('../services/schemeActaService');

const reduceNotasData = (data, esquema) => {
    const groupedData = {};

    data.forEach((item) => {
        const { estudiante, tipo_evaluacion, est_id, cedula } = item;

        // Si el estudiante no está en el objeto, lo agregamos
        if (!groupedData[est_id]) {
            groupedData[est_id] = {
                id: est_id,
                cedula: cedula,
                nombres: estudiante,
                notas: [],
                promedioTotal: { nombre: "PROMEDIO TOTAL", valor: 0, base: 0 }
            };
        }

        // Buscar el esquema correspondiente
        const esquemaEvaluacion = esquema.find(e => e.comp_nombre === tipo_evaluacion);

        if (esquemaEvaluacion) {
            const parent = esquemaEvaluacion.comp_parent_nombre;

            // Si es parte de un componente compuesto, agruparlo dentro de su padre
            if (parent) {
                let componente = groupedData[est_id].notas.find(nota => nota.nombre === parent);

                if (!componente) {
                    componente = {
                        componentes: { nombre: `COMPONENTES ${parent.toUpperCase()}:`, listado: [] },
                        nombre: parent,
                        valor: 0,
                        base: 0
                    };
                    groupedData[est_id].notas.push(componente);
                }

                // Agregar la nota al componente padre
                componente.componentes.listado.push({
                    nombre: tipo_evaluacion,
                    valor: parseFloat(item.nota),
                    base: parseFloat(item.base)
                });

                // Acumular valores
                componente.valor += parseFloat(item.nota);
                componente.base += parseFloat(item.base);
            } else {
                // Evaluación independiente
                groupedData[est_id].notas.push({
                    nombre: tipo_evaluacion,
                    valor: parseFloat(item.nota),
                    base: parseFloat(item.base)
                });
            }

            // Acumular para el promedio total
            groupedData[est_id].promedioTotal.valor += parseFloat(item.nota);
            groupedData[est_id].promedioTotal.base += parseFloat(item.base);
        }
    });

    return Object.values(groupedData);
};


exports.GetNotasService = async (trabajo_id) => {
    try {
        const data = await GetNotasTrabajoService(trabajo_id);
        const modalidad = await GetModalidadTrabajoService(trabajo_id);
        const modalidad_id = modalidad?.id;
        // Obtener el esquema de notas
        const esquema = await GetNotasSchemeActaService(modalidad_id); 
        const groupedData = reduceNotasData(data, esquema)?.map(nota => {
            nota.promedioTotal.valor = (nota.promedioTotal.valor / nota.promedioTotal.base)*100;
            nota.promedioTotal.base = 100;
            return nota;
        });
        return groupedData;
    } catch (error) {
        const msg = { message: 'Error al obtener notas de estudiantes.', error }
        console.log(msg)
        throw new Error(msg);
    }
};
