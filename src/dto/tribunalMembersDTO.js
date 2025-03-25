const { asIngMg } = require('../utils/strUtility');

exports.GetTribunalFromTesisFullDTO = (tesisData) => {
    const sep = ":<br> ";
    // Contenido de tribunal ejemplo:
    // {
    //     "tribunal": [
    //         "DELEGADO COM. INVESTIGACIÓN CIENTIFÍCA:<br> TAMIÑAWI SUMI SUMIWKA MANIKO",
    //         "DELEGADO H. CONSEJO DIRECTIVO:<br> ANA GABRIELA YUKATAN SLOVAKY",
    //         "DOCENTE DEL ÁREA:<br> PEDRO MANOLO ANESTECIO ONETWO"
    //       ]
    // }
    // convierte tribunal en un objeto:
    // console.log("tesisData.tribunal")
    // console.log(tesisData.tribunal)
    return {
        delegadoComisionCientifica: asIngMg(tesisData.tribunal[0].split(sep)[1]),
        delegadoConsejoDirectivo: asIngMg(tesisData.tribunal[1].split(sep)[1]),
        docenteDeArea: asIngMg(tesisData.tribunal[2].split(sep)[1])
    };
};


exports.UngetTribunalFromTesisFullDTO = (nameTribunalMembers) => {
    const normalizeNameMember = (nameMember) => {
        nameMember = nameMember.split(".")[1];
        nameMember = nameMember.split(",")[0];
        return nameMember.toUpperCase().trim();
    }
    return {
        delegadoComisionCientifica: normalizeNameMember(nameTribunalMembers.delegadoComisionCientifica),
        delegadoConsejoDirectivo: normalizeNameMember(nameTribunalMembers.delegadoConsejoDirectivo),
        docenteDeArea: normalizeNameMember(nameTribunalMembers.docenteDeArea),
      };
}
