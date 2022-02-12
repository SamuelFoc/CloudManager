const filer         = require("../services/fileServices");
const fs            = require("fs");
const { concat }    = require("rxjs/operators");
const User = require("../models/user");

const open_folder = (req, res) => {
    const folderName = req.params.folder;
    const content = fs.readdirSync(`./CLOUD/${folderName}`);
    extensions = filer.readExtensions(content);

    const breadCrumb = req.originalUrl.split("/").slice(1);
    var references = [];
    console.log(breadCrumb, breadCrumb[0])
    
    for (let i = 0; i < breadCrumb.length; i++){
        if(i < 1){
            references.push("/".concat(breadCrumb[i]));
        } else {
            references.push(references[i-1].concat("/", breadCrumb[i]));
        }
    }

    res.render("index", 
        {
            message: req.session.messageObj.message, 
            data: content, 
            status: req.session.messageObj.status,
            extensions: extensions,
            url: req.originalUrl,
            breadCrumb: breadCrumb,
            references: references
        })
    
}

const open_CLOUD = (req, res) => {
    data = fs.readdirSync(`./CLOUD/${req.session.passport.user}`);
    extensions = filer.readExtensions(data);
    
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

    if(req.session.views > 1){
        var message = new Date();
        var message = `Today is ${message.toDateString()}, hope you have a nice day`;
    } else {
        message = "Welcome to your cloud storage";
    }

    const newUrl = req.originalUrl + "/" + req.session.passport.user;
    console.log(newUrl)

    
    User.find({_id: req.session.passport.user}, (err, user) => {
        isAdmin = user[0].isAdmin;
        res.render("index", 
        {
            message: message, 
            data: data, 
            status: "primary",
            extensions: extensions,
            url: newUrl,
            breadCrumb: breadCrumb,
            references: references,
            isAdmin: isAdmin
        })
    })
}



module.exports = {
    open_folder,
    open_CLOUD

}