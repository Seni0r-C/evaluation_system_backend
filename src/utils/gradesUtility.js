function customRound(num) {
    return (num % 1 >= 0.5) ? Math.ceil(num) : Math.floor(num);
}

function getBaseFromSum(notaNumber) {
    notaNumber = String(notaNumber);
    const notaNumberBase = String(Number(notaNumber[0]) + 1).padEnd(notaNumber.length, "0");
    return parseInt(notaNumberBase);
}

const calcAverageGrades = (data, estudiante) => {
    const grades = [];
    for (const seccion in data[estudiante]) {
        const notas = data[estudiante][seccion].map(e => e.nota);
        const suma = notas.reduce((a, b) => a + b, 0);
        const promedio = suma / notas.length;
        grades.push({
            nombre: seccion,
            sum: suma,
            mean: promedio,
            valor: customRound(promedio),
            base: data[estudiante][seccion][0].base
        });
    }
    return grades;
}

const newGradesStudentDataComplexivo = (grades) => {
    //aquí aplicamos la de Jostin :) xd
    const examenPractico = grades.filter((nota) => nota.nombre !== 'EXAMEN TEORICO');
    const examenTeorico = grades.filter((nota) => nota.nombre === 'EXAMEN TEORICO')[0];
    const examenPracticoAvg = (examenPractico.reduce((a, b) => a + b.valor, 0) / examenPractico.length) * 0.6;
    const baseExamenPractico = 60;
    const baseExamenTeorico = 40;

    const examenTeoricoAvg = (examenTeorico.valor * 0.4);


    return [
        {
            nombre: "EXAMEN PRACTICO",
            sum: examenPractico.reduce((a, b) => a + b.valor, 0),
            mean: examenPracticoAvg,
            valor: customRound(examenPracticoAvg),
            base: baseExamenPractico
        },
        {
            nombre: "EXAMEN TEORICO",
            sum: examenTeoricoAvg,
            mean: examenTeoricoAvg,
            valor: customRound(examenTeoricoAvg),
            base: baseExamenTeorico
        },
    ]
}

const newGradesStudentDataArticuloAcademico = (grades) => {
    const informeFinal = grades.filter((nota) => nota.nombre === "INDEXACIÓN")?.[0];
    if (!informeFinal) {
        return "INFORME FINAL no encontrado";
    }
    console.log("informeFinal", informeFinal);
    const defensa = grades.filter((nota) => nota.nombre === "DEFENSA");
    const baseIndexacion = informeFinal.valor;
    const baseInversaIndexacionPercent = (100 - informeFinal.valor) / 100;
    const totalDefensa = defensa.reduce((a, b) => a + b.valor, 0);
    return [
        {
            nombre: "INFORME FINAL",
            sum: baseIndexacion,
            mean: baseIndexacion,
            valor: baseIndexacion,
            base: baseIndexacion
        },
        {
            nombre: "DEFENSA",
            sum: totalDefensa,
            mean: totalDefensa * baseInversaIndexacionPercent,
            valor: customRound(totalDefensa * baseInversaIndexacionPercent),
            base: baseInversaIndexacionPercent * 100
        }
    ]
}

const modalidadTitulacionesMap = {
    "complexivo": [
        'examen complexivo',
        'exámen complexivo',
    ],
    "propuesta_tecnologica": [
        'propuesta tecnologica',
        'propuesta tecnológica',
    ],
    "articulo_academico": [
        'artículo académico',
        'artículo científico',
        'articulo cientifico',
        'articulo academico'
    ]
}

const modaidadTypelAdapter = (modalidadTitulacion) => {
    const keyModalidad = modalidadTitulacion.nombre?.toLowerCase();
    const entrySelected = Object.entries(modalidadTitulacionesMap).find(([key, values]) => {
        return values.includes(keyModalidad);
    });
    if (!entrySelected) {
        return "propuesta_tecnologica";
    }
    return entrySelected[0];
}

exports.calcGrades = calcGrades = (data, modalidadTitulacion) => {
    modalidadTitulacion = modaidadTypelAdapter(modalidadTitulacion);
    let studentData = null;
    let newStudentData = null;
    const studentsGrade = [];

    for (const estudiante in data) {
        newStudentData = {};
        studentData = Object.values(data[estudiante])[0][0];
        console.log(studentData);
        newStudentData = {
            est_id: studentData.est_id,
            cedula: studentData.cedula,
            nombres: estudiante,
            notas: calcAverageGrades(data, estudiante),
        };
        if (modalidadTitulacion === "propuesta_tecnologica") {
            let average = newStudentData.notas.reduce((a, b) => a + b.valor, 0);
            newStudentData.promedioTotal = {
                nombre: "PROMEDIO TOTAL",
                mean: (average / getBaseFromSum(average)) * 100,
                valor: (average / getBaseFromSum(average)) * 100,
                base: 100
            };
            newStudentData.promedioTotal.valor = customRound(newStudentData.promedioTotal.valor);
        }
        if (modalidadTitulacion === "complexivo") {
            newStudentData.notas = newGradesStudentDataComplexivo(newStudentData.notas);
            let sumita = newStudentData.notas.reduce((a, b) => a + b.valor, 0);
            newStudentData.promedioTotal = {
                nombre: "TOTAL",
                suma: sumita,
                valor: customRound(sumita),
                base: 100
            };
        }
        if (modalidadTitulacion === "articulo_academico") {
            newStudentData.notas = newGradesStudentDataArticuloAcademico(newStudentData.notas);
            let sumita = newStudentData.notas.reduce((a, b) => a + b.valor, 0);
            newStudentData.promedioTotal = {
                nombre: "TOTAL",
                suma: sumita,
                valor: customRound(sumita),
                base: 100
            };
        }
        studentsGrade.push(newStudentData);
    }
    return studentsGrade;
};