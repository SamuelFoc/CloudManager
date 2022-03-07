const path              = require("path");
const fs                = require("fs");
const filer             = require("../services/fileServices");
const messenger         = require("../services/messenger");
const User              = require("../models/user");
const bcrypt            = require("bcrypt");


//FILES OPERATIONS
//Downloading files
const download_file = (req, res) => {
    const url = req.params.url;
    var file = req.params.file;
    var fileLocation = path.join(`${process.env.BASE_DIRECTORY}/${url}/`,file);

    res.download(fileLocation, file, (err) => {
        if (err) {
            req.session.messageObj = messenger.general_error;
            throw err;
        } else {
            req.session.messageObj = messenger.general_success;
            req.session.save();
        }
    });
    res.redirect("back")
}

//Uploading file/files
const upload_file = (req, res) => {
    const baseFolder = `${process.env.BASE_DIRECTORY}/${req.params.url}`;

    filer.uploadFilesAuto(req, res, baseFolder);
    res.redirect("back");
};

//Deleting files
const delete_file = (req, res) => {
    const url = req.params.url;
    const dir = `${process.env.BASE_DIRECTORY}/${url}`;

    if (fs.existsSync(dir)){
        fs.unlinkSync(dir)
            req.session.messageObj = messenger.general_success;
            req.session.save();
            res.redirect("back");
    }
};

//Renaming files
const rename_file = (req, res) => {
    const url = req.params.url;
    const newName = req.body.name;
    const oldName = req.params.name;
    const extension = oldName.split(".").slice(1)[0];

    const currPath = `${process.env.BASE_DIRECTORY}/${url}/${oldName}`;
    const newPath = `${process.env.BASE_DIRECTORY}/${url}/${newName}.${extension}`;

    fs.rename(currPath, newPath, function(err) {
        if (err) {
          console.log(err)
          req.session.messageObj = messenger.general_error;
          req.session.save();
        } else {
          req.session.messageObj = messenger.general_success;
          req.session.save();
        }
      })
    res.redirect("back");
}

//Viewing files
const view_file = (req, res) => {
    const fileName = req.params.file;
    const url = req.params.url;

    var data = fs.createReadStream(`${process.env.BASE_DIRECTORY}/${url}/${fileName}`);
    var stat = fs.statSync(`${process.env.BASE_DIRECTORY}/${url}/${fileName}`)
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

//FOLDERS OPERATIONS
//Creating folders
const create_folder = (req, res) => {
    const url = req.params.url;
    const id = url.split("/")[0]; 
    const fileName = req.body.name;
    const videoFolderBool = req.body.videoFolder;
    var dir =  `${process.env.BASE_DIRECTORY}/${url}/${fileName}`;

    if(!filer.isalnum(fileName)){
        req.session.messageObj = messenger.warning_punctuation;
        req.session.save();
    } else {
        if (videoFolderBool){
            if (!fs.existsSync(dir)){
                dir = dir + ".VP";
                fs.mkdirSync(dir)
                req.session.messageObj = messenger.general_success;
                req.session.save();

                User.findOneAndUpdate(
                    { 
                        _id: id,
                    }, 
                    { 
                        $push: { moviesFolders: { "parentFolder": fileName}}
                    }
                ).then(result => console.log(result))
                res.redirect("back");
            }
        } else {
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir, (err) => {
                    if (err) {
                        req.session.messageObj = messenger.general_error;
                        throw err;
                    } else {
                        req.session.messageObj = messenger.general_success;
                        req.session.save();
                    }
                })
                res.redirect("back");
            }
        }
    }
};

//Deleting folders
const delete_folder = (req, res) => {
    const dir = `${process.env.BASE_DIRECTORY}/${req.params.url}`; 

    fs.rmdir(dir, { recursive: true }, (err) => {
        if (err) {
            req.session.messageObj = messenger.general_error;
            throw err;
        } else {
            req.session.messageObj = messenger.general_success;
            req.session.save();
        }
        res.redirect("back");
    })
};

const delete_videoFolder = (req, res) => {
    const dir = `${process.env.BASE_DIRECTORY}/${req.params.url}`; 
    const id = req.params.url.split("/")[0];
    const dirName = req.params.url.split("/").pop().split(".")[0];

    fs.rmdir(dir, { recursive: true }, (err) => {
        if (err) {
            req.session.messageObj = messenger.general_error;
            throw err;
        } else {
            req.session.messageObj = messenger.general_success;
            req.session.save();
        }
        res.redirect("back");
    })

    User.findOneAndUpdate(
        { 
            _id: id,
        }, 
        { 
            $pull: { moviesFolders: { "parentFolder": dirName}}
        }
    ).then((result) => console.log(result))

    console.log("Videofolder deleted")
}

//Renaming folders
const rename_folder = (req, res) => {
    const url = req.params.url;
    const newName = req.body.name;
    const oldName = req.params.name;

    const currPath = `${process.env.BASE_DIRECTORY}/${url}/${oldName}`;
    const newPath = `${process.env.BASE_DIRECTORY}/${url}/${newName}`;

    console.log(currPath, newPath);
    if(filer.isalnum(newName)){
        fs.rename(currPath, newPath, (err) => {
            if (err) {
              console.log(err)
              req.session.messageObj = messenger.general_error;
            } else {
              req.session.messageObj = messenger.general_success;
            }
          })
    } else {
        req.session.messageObj = messenger.warning("Folder name cannot contain special or punctuations characters.")
    }
    res.redirect("back");
}

//SETUP
//Pasword setup
const change_password = (req, res) => {
    const id = req.session.passport.user;
    const oldPass = req.body.oldPassword;
    const newPass = req.body.newPassword;

    verifyPasswordAndChange(id, oldPass, newPass)
    req.session.messageObj = messenger.general_success;
    req.session.save();
    res.redirect("back");
}

//Private functions
function verifyPasswordAndChange(id, oldPassword, newPass){
    User.findOne({_id: id}, (err, user) => {
        if (err){return err}

        bcrypt.compare(oldPassword, user.password, (err, res) => {
            if (err){
                console.log(err);
            }

            bcrypt.genSalt(10, (err, salt) => {
                if (err){
                    console.log(err);
                }
                bcrypt.hash(`${newPass}`, salt, (err, hash) => {
                    if (err){
                        console.log(err);
                    }
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
                        )
                        .catch(err => {
                            console.log(err);
                        })
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
    delete_videoFolder,
    create_folder,
    change_password,
    rename_folder,
    rename_file
}