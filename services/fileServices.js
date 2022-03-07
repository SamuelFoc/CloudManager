const fs                = require("fs");
const messenger         = require("./messenger");


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
        } else if (extensions[i] === "avi" || extensions[i] === "mp4" || extensions[i] === "mkv"){
            extensions[i] = "film";
        } else if (extensions[i] === "vp"){
            extensions[i] = "desktop";
        }
         else {
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

    file.mv(`${basePath}` + fileName, (err) => {
        console.log(err)
    })
}

const viewCounter = function(req){
    if (req.session.views){
        req.session.views++;
    } else {
        req.session.views = 1;
    }
}

const removeExtensions = function(data){
    dataRaw = [];
    data.forEach(element => {
        nameArray = element.split(".");
        nameArray.pop();
        nameRaw = nameArray.join("");
        dataRaw.push(nameRaw);
    })
    return dataRaw
}

const intersectArrays = function(arrayFolder, arrayDB, parentFolder){
    intersection = [];
    news = [];
    unnecessary = [];

    if(arrayFolder.length > arrayDB.length && arrayFolder.length !== 0 && arrayDB.length !== 0){
        console.log("Folder has some new items..Synchronization with database in progress...")
        for(let i = 0; i < arrayFolder.length; i++){
            arrayDB.forEach(element => {
                if(element.movieName === arrayFolder[i]){
                    intersection.push(arrayFolder[i]);
                } else {
                    news.push({
                        movieName: arrayFolder[i]
                    });
                }
            })
        }
        console.log("Synchronization done!")
    } else if (arrayFolder.length < arrayDB.length && arrayFolder.length !== 0 && arrayDB.length !== 0){
        console.log("Database has some old items..Removing old items...")
        for(let i = 0; i < arrayFolder.length; i++){
            arrayDB.forEach(element => {
                if(element.movieName === arrayFolder[i]){
                    intersection.push(arrayFolder[i]);
                } else {
                    unnecessary.push({
                        movieName: arrayFolder[i]
                    });
                }
            })
        }
        console.log("Old items removed!")
    } else if (arrayDB.length === 0 && arrayFolder !== 0){
        console.log("DB is empty..Synchronization started...")
        arrayFolder.forEach( movie => {news.push({
            movieName: movie
        })})
        console.log("Synchronization done!")
    } else if (arrayFolder.length === 0 && arrayDB !== 0){
        console.log("Folder is empty..Removing DB items...")
        arrayDB.forEach(movie => {unnecessary.push({
            movieName: movie.movieName
        })})
        console.log("DB items removed!")
    } else if (arrayFolder.length === arrayDB.length && arrayFolder.length !== 0){
        console.log("DB is up to date! :)")
        arrayFolder.forEach(item => intersection.push(item))
    } else if (arrayFolder.length === arrayDB.length && arrayFolder.length === 0 && arrayDB.length === 0){
        console.log("You don't have any videos yet.")
    }

    return {intersection: intersection, news: news, unnecessary: unnecessary}
}

const isalnum = function(str){
    var code, i, len;
      
        for (i = 0, len = str.length; i < len; i++) {
          code = str.charCodeAt(i);
          if (!(code > 47 && code < 58) && // numeric (0-9)
              !(code > 64 && code < 91) && // upper alpha (A-Z)
              !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
          }
        }
        return true;
}

const uploadFilesAuto = function(req, res, saveTo){
    const files = req.files.files;
    const baseFolder = saveTo;
    let existingFiles = fs.readdirSync(baseFolder);

    if(files.length){
        for(let i = 0; i < files.length; i++){
            
            let match = existingFiles.filter((file) => {
                return file === files[i].name
            });
            
            if (match.length !== 0){
                req.session.messageObj = messenger.error(`File named ${fileName}, aleready exists! Uploading stopped.`)
                req.session.save();
                break;
            } else {
                uploadFileToDirectory(files[i], `${baseFolder}/`);
                req.session.messageObj = messenger.general_success;
                req.session.save();
            }
        }
    } else {
        var file = req.files.files
        let oldData = fs.readdirSync(baseFolder);
        let match = oldData.filter((oldfile) => {
            return oldfile === file.name
        });

        if (match.length !== 0){
            req.session.messageObj = messenger.error("File already exists!")
            req.session.save();
        } else {
            uploadFileToDirectory(file, `${baseFolder}/`);
            req.session.messageObj = messenger.general_success;
            req.session.save();
        }
    }
}

module.exports = {
    readExtensions,
    findMatch,
    uploadFileToDirectory,
    viewCounter,
    removeExtensions,
    intersectArrays,
    isalnum,
    uploadFilesAuto
}