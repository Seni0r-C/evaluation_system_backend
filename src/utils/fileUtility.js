const path = require('path');

function getWorkDirPath() {
    return __dirname.split(path.sep).slice(0, -2).join(path.sep);
}

const WORK_DIR = getWorkDirPath();
const FILE_DIR = path.join(WORK_DIR, 'doc');
const TEMP_FILE_DIR = path.join(WORK_DIR,'temp');
const TEMPLATE_FILE_DIR = path.join(WORK_DIR,'templates');
const TEMPLATE_ASSETS_FILE_DIR = path.join(TEMPLATE_FILE_DIR,"assets");


exports.buildStaticPath = function (aditionalPath) {
    const filePath = path.join(WORK_DIR, aditionalPath);
    return filePath;   
}

exports.buildDocPath = function (nameFile) {
    const filePath = path.join(FILE_DIR, nameFile);
    return filePath;   
}

exports.buildTempFilesPath = function (nameFile) {
    const filePath = path.join(TEMP_FILE_DIR, nameFile);
    return filePath;   
}

exports.buildTemplatePath = function (nameFile) {
    const filePath = path.join(TEMPLATE_FILE_DIR, nameFile);
    return filePath;   
}

exports.buildTemplateAssetsPath = function (nameFile) {
    const filePath = path.join(TEMPLATE_ASSETS_FILE_DIR, nameFile);
    return filePath;   
}

exports.ensureFileExtension = (nameFile, fileExtension)=> {
    return nameFile?.includes(fileExtension) ? nameFile : `${nameFile}.${fileExtension}`;
}
