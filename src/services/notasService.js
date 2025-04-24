const { GetNotasTrabajoService, GetModalidadTrabajoService, GetNotasByEvalTypeTrabajoService } = require('../services/trabajoTitulacionService');
const { GetNotasSchemeActaService } = require('../services/schemeActaService');
const { groupsBy } = require('../utils/groupListUtility');
const { calcGrades } = require('../utils/gradesUtility');

const reduceNotasData = (data, esquema) => {
    const groupedData = {};
    // console.log("reduceNotasData: JSON.stringify(data);")
    // console.log(JSON.stringify(data));
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

function customRound(num) {
    return (num % 1 >= 0.5) ? Math.ceil(num) : Math.floor(num);
}


// Function to group by "nombre" and calculate sum and mean
const groupAndCalculate = (data) => {
    return data.map(student => {
        // Grouping by "nombre"
        const groupedNotas = student.notas.reduce((acc, nota) => {
            if (!acc[nota.nombre]) {
                acc[nota.nombre] = [];
            }
            acc[nota.nombre].push(nota.valor);
            return acc;
        }, {});

        // Calculate sum and mean for each group
        const groupedSummary = Object.keys(groupedNotas).map(nombre => {
            const valores = groupedNotas[nombre];
            const sum = valores.reduce((total, valor) => total + valor, 0);
            const mean = sum / valores.length;

            return {
                nombre,
                sum,
                mean: customRound(mean),
                valor: parseInt(customRound(mean)+""),
                base: 100
            };
        });

        student.promedioTotal.valor = parseInt(customRound(student.promedioTotal.valor)+"");

        return {
            ...student,
            notas: groupedSummary
        };
    });
};


exports.GetNotasService = async (trabajo_id) => {
    console.log("groupedDataWithSummary")
    try {
        const data = await GetNotasTrabajoService(trabajo_id);
        const modalidad = await GetModalidadTrabajoService(trabajo_id);
        // const modalidad_id = modalidad?.id;
        // Obtener el esquema de notas
        // const esquema = await GetNotasSchemeActaService(modalidad_id);
        // console.log("esquema");
        // console.log(esquema);
        // const result = groupsBy(data, 'estudiante.docente.tipo_evaluacion', true, (item)=>{
        const result = groupsBy(data, 'estudiante.tipo_evaluacion', true, (item)=>{
            item.nota = parseInt(item.nota);
            item.base = parseInt(item.base);
            return item;
        });
        const groupedData = calcGrades(result, modalidad);
        // console.log("result");
        // console.log(JSON.stringify(result, null, 2));
        // console.log("Rest of summary");
        // console.log(modalidad);
        // console.log("groupedData");
        // console.log(JSON.stringify(groupedData, null, 2));
        return groupedData;
        // const groupedData = reduceNotasData(data, esquema)?.map(nota => {
        //     nota.promedioTotal.valor = ((nota.promedioTotal.valor / nota.promedioTotal.base) * 100);
        //     nota.promedioTotal.base = 100;
        //     return nota;
        // });
        // const groupedDataWithSummary = groupAndCalculate(groupedData);
        // console.log(JSON.stringify(groupedDataWithSummary, null, 2));
        // return groupedDataWithSummary;
    } catch (error) {
        const msg = { message: 'Error al obtener notas de estudiantes.', error }
        console.log(msg)
        throw new Error(msg);
    }
};

exports.GetByEvalTypeNotasService = async (trabajo_id, eval_type_id) => {
    try {
        const data = await GetNotasByEvalTypeTrabajoService(trabajo_id, eval_type_id);
        return data;
    } catch (error) {
        const msg = { message: 'Error al obtener notas de estudiantes por tipo de evaluación.', error }
        console.log(msg)
        throw new Error(msg);
    }
};

