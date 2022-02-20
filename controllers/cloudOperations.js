const path              = require("path");
const fs                = require("fs");
const filer             = require("../services/fileServices");
const User              = require("../models/user");
const bcrypt            = require("bcrypt");

const download_file = (req, res) => {
    var file = req.params.file;
    const url = req.params.url;
    var fileLocation = path.join(`./${url}/`,file);
    res.download(fileLocation, file);
}

const upload_file = (req, res) => {
    const files = req.files.files;
    let existingFiles = fs.readdirSync(`./${req.params.url}`);
    var rejection = false;
    
    if(files.length){
        for(let i = 0; i < files.length; i++){
            var fileName = files[i].name

            let match = existingFiles.filter((file) => {
                return file === fileName
            });
    
        if (match.length !== 0){
            console.log("matched");
            console.log(fileName);
            req.session.messageObj = {
                status: "warning",
                message: `File named ${fileName}, aleready exists! Uploading stopped.`
            }
            rejection = true;
            res.redirect(`back`)
            break;
        } else {
            filer.uploadFileToDirectory(files[i], "./"+`${req.params.url}` + "/");
            console.log("File: " + `${fileName}` + " was saved to: " + "./"+`${req.params.url}` + "/")
            req.session.messageObj = {
                message: "Files uploaded successfully.",
                status: "success"
            }
        }
        }
        if(!rejection){
            res.redirect(`/${req.params.url}`);
        }
    } else {
        var file = req.files.files
        var fileName = file.name
        let data = fs.readdirSync(`./${req.params.url}`);
        let match = data.filter((file) => {
            return file === fileName
        });

        if (match.length !== 0){
            console.log("matched")
            req.session.messageObj = {
                status: "warning",
                message: "File already exists"
            }
            res.redirect(`/${req.params.url}`)
        } else {
            filer.uploadFileToDirectory(file, "./"+`${req.params.url}` + "/");
            console.log("File: " + `${fileName}` + " was saved to: " + "./"+`${req.params.url}` + "/")
            req.session.messageObj = {
                message: "File uploaded successfully.",
                status: "success"
            }
            res.redirect(`back`)
        }
    }
};


const delete_file = (req, res) => {
    const url = req.params.url; 
    const dir = "./" + url;

    if (fs.existsSync(dir)){
        fs.unlinkSync(dir);
        req.session.messageObj = {
            message: `File ${url} deleted successfully`,
            status: "success"
        };
    }

    res.redirect("back");
};


const view_file = (req, res) => {
    const fileName = req.params.file;
    const url = req.params.url;
    console.log(url)
    var data = fs.createReadStream(`./${url}/${fileName}`);
    var stat = fs.statSync(`./${url}/${fileName}`)
    var extension = fileName.split('.').pop();

    res.setHeader("Content-Length", stat.size);
    if (extension === "pdf"){
        res.setHeader("Content-type", `application/${extension}`);
    } else {
        res.setHeader("Content-type", `${extension}`);
    }
    res.setHeader("Content-Disposition", `inline; filename=quote.${extension}`)
    data.pipe(res);
};


const create_folder = (req, res) => {
    const url = req.params.url; 
    const fileName = req.body.name;
    const videoFolderBool = req.body.videoFolder;
    var dir = "./" + url + "/" +fileName;

    if (videoFolderBool){
        if (!fs.existsSync(dir)){
            dir = dir + ".VP";
            fs.mkdirSync(dir);
            req.session.messageObj = {
                message: `Folder ${fileName} at ${url} created successfully.`,
                status: "info"
            }
        }
    } else {
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
            req.session.messageObj = {
                message: `Folder ${fileName} at ${url} created successfully.`,
                status: "info"
            }
        }
    }
    
    res.redirect("back");
};


const delete_folder = (req, res) => {
    const url = req.params.url; 
    const dir = "./" + url;

    fs.rmdir(dir, { recursive: true }, (err) => {
        if (err) {
            req.session.messageObj = {
                message: `Sorry, there occured some problems deleting the file, please try it again.`,
                status: "danger"
            }
            throw err;
        } else {
            req.session.messageObj = {
                message: `Folder ${url} deleted successfully.`,
                status: "info"
            }
        }
        res.redirect("back");
    })
};

const rename_folder = (req, res) => {
    const url = req.params.url;
    const newName = req.body.name;
    const oldName = req.params.name;

    const currPath = url + "/" + oldName;
    const newPath = url + "/" + newName;

    console.log(currPath, newPath);
    fs.rename(currPath, newPath, function(err) {
        if (err) {
          console.log(err)
        } else {
          console.log("Successfully renamed the directory.")
        }
      })

    res.redirect("back");
}

const rename_file = (req, res) => {
    const url = req.params.url;
    const newName = req.body.name;
    const oldName = req.params.name;
    const extension = oldName.split(".").slice(1)[0];

    const currPath = url + "/" + oldName;
    const newPath = url + "/" + newName + "." + extension;

    console.log(currPath, newPath);
    fs.rename(currPath, newPath, function(err) {
        if (err) {
          console.log(err)
        } else {
          console.log("Successfully renamed the directory.")
        }
      })

    res.redirect("back");
}

const change_password = (req, res) => {
    const id = req.session.passport.user;
    const oldPass = req.body.oldPassword;
    const newPass = req.body.newPassword;

    verifyPasswordAndChange(id, oldPass, newPass);
    res.redirect("back");
}

function verifyPasswordAndChange(id, oldPassword, newPass){
    User.findOne({_id: id}, (err, user) => {
        if (err){return err}
        if (!user){return console.log("Incorrect id.")}

        bcrypt.compare(oldPassword, user.password, (err, res) => {
            if (err) return err;

            if (res === false){return console.log("Incorrect password.")}

            bcrypt.genSalt(10, function (err, salt) {
                if (err) return err;
                bcrypt.hash(`${newPass}`, salt, function (err, hash) {
                    if (err) return err
                    console.log(hash)
                    User.updateOne(
                        {
                                _id: id
                        }, 
                        {
                            $set: 
                            {
                                "password": hash,
                            }
                        }
                        ).then((user) => console.log(user))
                });
            });
        });
    });
};

module.exports = {
    download_file,
    upload_file,
    view_file,
    delete_file,
    delete_folder,
    create_folder,
    change_password,
    rename_folder,
    rename_file
}