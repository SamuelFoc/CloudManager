const filer         = require("../services/fileServices");
const fs            = require("fs");
const User = require("../models/user");
require("dotenv").config();

const open_folder = (req, res) => {
    const id = req.session.passport.user;
    const folderName = req.params.folder;
    const content = fs.readdirSync(`${process.env.BASE_DIRECTORY}/${folderName}`);
    var extensions = filer.readExtensions(content);

    const breadCrumb = req.originalUrl.split("/").slice(1);

    var references = [];    
    for (let i = 0; i < breadCrumb.length; i++){
        if(i < 1){
            references.push("/".concat(breadCrumb[i].toString()));
        } else {
            references.push(references[i-1].concat("/", breadCrumb[i].toString()));
        }
    }

    var isAdmin;
    User.find({_id: req.session.passport.user}, (err, user) => {
        isAdmin = user[0].isAdmin;
    });

    res.render("index", 
        {
            message: req.session.messageObj.message, 
            data: content, 
            status: req.session.messageObj.status,
            extensions: extensions,
            url: req.params.folder,
            breadCrumb: breadCrumb,
            references: references,
            id: id,
            isAdmin: isAdmin
        }
    )
    req.session.messageObj = {message: "", status: "secondary"};
    req.session.save();
}

const open_CLOUD = (req, res) => {
    const id = req.session.passport.user;
    const data = fs.readdirSync(`${process.env.BASE_DIRECTORY}/${id}`);
    const extensions = filer.readExtensions(data);
    var breadCrumb = req.originalUrl.split("/").slice(1);
    var references = [];
    
    for (let i = 0; i < breadCrumb.length; i++){
        if(i < 1){
            references.push("/".concat(breadCrumb[i]));
        } else {
            references.push(breadCrumb[i-1].concat("/", breadCrumb[i]));
        }
    }

    if(req.session.messageObj == undefined){
        req.session.messageObj = {
            message: "Welcome to your cloud storage",
            status: "primary"
        }
    }
    var message = req.session.messageObj.message;
    var status = req.session.messageObj.status;
    
    User.find({_id: req.session.passport.user}, (err, user) => {
        isAdmin = user[0].isAdmin;
        res.render("index", 
        {
            message: message,
            data: data, 
            status: status,
            extensions: extensions,
            id: id,
            url: id,
            breadCrumb: breadCrumb,
            references: references,
            isAdmin: isAdmin
        })
    })

    req.session.messageObj = {message: "", status: "secondary"};
    req.session.save();
}



module.exports = {
    open_folder,
    open_CLOUD

}