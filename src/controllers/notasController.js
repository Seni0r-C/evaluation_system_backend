const { GetNotasTrabajoService, GetModalidadTrabajoService } = require('../services/trabajoTitulacionService');
const { GetNotasSchemeActaService } = require('../services/schemeActaService');

const reduceNotasData = (data, esquema) => {
    const groupedData = {};
    
    data.forEach((item) => {
        const estudiante = item.estudiante;
        const tipo_evaluacion = item.tipo_evaluacion;

        // Si el estudiante no está en el objeto, lo agregamos
        if (!groupedData[estudiante]) {
            groupedData[estudiante] = { notas: [], promedioTotal: { nombre: "PROMEDIO TOTAL", valor: 0, base: 0 } };
        }

        // Buscar el esquema correspondiente
        const esquemaEvaluacion = esquema.find(e => e.comp_nombre === tipo_evaluacion);

        if (esquemaEvaluacion) {
            const parent = esquemaEvaluacion.comp_parent_nombre;

            // Si es parte de un componente compuesto, agruparlo dentro de su padre
            if (parent) {
                let componente = groupedData[estudiante].notas.find(nota => nota.nombre === parent);
                
                if (!componente) {
                    componente = {
                        componentes: { nombre: `COMPONENTES ${parent.toUpperCase()}:`, listado: [] },
                        nombre: parent,
                        valor: 0,
                        base: 0
                    };
                    groupedData[estudiante].notas.push(componente);
                }

                // Agregar la nota al componente padre
                componente.componentes.listado.push({
                    nombre: `${tipo_evaluacion}`,
                    valor: parseFloat(item.nota),
                    base: parseFloat(item.base)
                });

                // Acumular valores
                componente.valor += parseFloat(item.nota);
                componente.base += parseFloat(item.base);
            } else {
                // Evaluación independiente
                groupedData[estudiante].notas.push({
                    nombre: tipo_evaluacion,
                    valor: parseFloat(item.nota),
                    base: parseFloat(item.base)
                });
            }

            // Acumular para el promedio total
            groupedData[estudiante].promedioTotal.valor += parseFloat(item.nota);
            groupedData[estudiante].promedioTotal.base += parseFloat(item.base);
        }
    });

    return groupedData;
};

exports.getNotas = async (req, res) => {
    try {
        const { trabajo_id } = req.params;
        const data = await GetNotasTrabajoService(trabajo_id);
        const modalidad = await GetModalidadTrabajoService(trabajo_id);
        const modalidad_id = modalidad?.id;
        console.log("GetIdModalidadTrabajoService");
        console.log("modalidad");
        console.log(modalidad);
        // Obtener el esquema de notas
        const esquema = await GetNotasSchemeActaService(modalidad_id); 
        console.log("GetNotasSchemeActaService");
        console.log("esquema");
        console.log(esquema);
        const groupedData = reduceNotasData(data, esquema);
        res.status(200).json(groupedData);
    } catch (error) {
        const msg = { message: 'Error al obtener el acta', error }
        console.log(msg)
        res.status(500).json(msg);
    }
};
