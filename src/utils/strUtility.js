 exports.capitalize = function(str) {
    if (typeof str !== 'string') {
        return '';
    }
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

exports.asIngMg = (nameProfessor) => {
    if (!nameProfessor) return null;
    return "Ing. "+this.capitalize(nameProfessor) + ", Mg.";
};

exports.asIngPhd = (nameProfessor) => {
    if (!nameProfessor) return null;
    return "Ing. "+this.capitalize(nameProfessor) + ", Ph.D.";
};