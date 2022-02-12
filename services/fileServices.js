const fs                = require("fs");


const readExtensions = function(data){
    var extensions = [];
    data.forEach(fileName => {
        var extension = fileName.split('.').pop();
        extensions.push(extension.toLowerCase());
    });
    for(let i = 0; i < extensions.length; i++){
        if (extensions[i] === "png" || extensions[i] === "jpg" || extensions[i] === "jpeg" || extensions[i] === "gif"){
            extensions[i] = "file-image";
        } else if (extensions[i] === "pdf"){
            extensions[i] = "file-pdf";
        } else if (extensions[i] === "txt"){
            extensions[i] = "file-alt";
        } else if (extensions[i] === "pptx"){
            extensions[i] = "file-powerpiont";
        } else if (extensions[i] === "doc" || extensions[i] === "docx"){
            extensions[i] = "file-word";
        } else if (extensions[i] === "xlsm" || extensions[i] === "xlsx" || extensions[i] === "xlsb" || extensions[i] === "xlm"){
            extensions[i] = "file-excel";
        } else if (extensions[i] === "html" || extensions[i] === "json" || extensions[i] === "cpp" || extensions[i] === "py"){
            extensions[i] = "file-code";
        } else if (extensions[i] === "js"){
            extensions[i] = "file-js"
        } else {
            extensions[i] = "folder"
        }
    };
    return extensions;
}

const findMatch = function(data, fileName){
    data.filter((file) => {
        return file === fileName
    });
}

const uploadFileToDirectory = function(file, basePath){
    var fileName = file.name;

    file.mv(`${basePath}` + fileName)
}

const viewCounter = function(req){
    if (req.session.views){
        req.session.views++;
    } else {
        req.session.views = 1;
    }
}

module.exports = {
    readExtensions,
    findMatch,
    uploadFileToDirectory,
    viewCounter
}