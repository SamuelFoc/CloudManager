const express           = require("express");
const session           = require("express-session");
const upload            = require("express-fileupload");
const path              = require("path");
const fs                = require("fs");
const MongoStore        = require("connect-mongo");

const filer             = require("./fileController");

const app = express();

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use(upload());

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, './views'));

app.use(
    session({
        secret: "some secret",
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/sessions" }),
        cookie: {
            maxAge: 20
        }
    })
);

app.get("/", (req, res) => {
    if (req.session.viewCount){
        req.session.viewCount++;
    } else {
        req.session.viewCount = 1;
    }
    res.redirect("/CLOUD");
});

app.get("/upload/CLOUD", (req, res) => res.redirect("/"))

app.get("/CLOUD", (req, res) => {
    data = fs.readdirSync("./CLOUD");
    extensions = filer.readExtensions(data);
    if(req.session.viewCount > 1){
        var message = new Date();
        var message = message.toDateString();
    } else {
        message = "Welcome to your cloud storage";
    }
    res.render("index", 
        {
            message: message, 
            data: data, 
            status: "primary",
            extensions: extensions,
            url: req.originalUrl,
        })
});

app.get("/download/:file", (req, res) => {
    var file = req.params.file;
    var fileLocation = path.join('./CLOUD',file);
    res.download(fileLocation, file);
});

app.get("/view/:file", (req, res) => {
    const fileName = req.params.file;
    var data = fs.createReadStream(`./CLOUD/${fileName}`);
    var stat = fs.statSync(`./CLOUD/${fileName}`)
    var extension = fileName.split('.').pop();

    res.setHeader("Content-Length", stat.size);
    if (extension === "pdf"){
        res.setHeader("Content-type", `application/${extension}`);
    } else {
        res.setHeader("Content-type", `${extension}`);
    }
    res.setHeader("Content-Disposition", `inline; filename=quote.${extension}`)
    data.pipe(res);
});

app.get("/CLOUD/:folder(*)", (req, res) => {
    const folderName = req.params.folder;
    const content = fs.readdirSync(`./CLOUD/${folderName}`);
    extensions = filer.readExtensions(content);
    res.render("index", 
        {
            message: `Folder name: ${folderName}`, 
            data: content, 
            status: "primary",
            extensions: extensions,
            url: req.originalUrl
        })
})

app.post("/upload/:url(*)", (req, res) => {
    if(req.files){
        var file = req.files.file
        var fileName = file.name
        
        let data = fs.readdirSync("./CLOUD");

        let extensions = filer.readExtensions(data);
        let match = data.filter((file) => {
            return file === fileName
        });
        console.log(match)
        console.log("running")
        if (match.length !== 0){
            console.log("matched")
            res.render("index", {
                message: "File already exists", 
                data: data, 
                status: "warning",
                extensions: extensions,
                url: req.originalUrl
            })
        } else {
            filer.uploadFileToDirectory(file, "./"+`${req.params.url}` + "/");
            console.log("File: " + `${fileName}` + " was saved to: " + "./"+`${req.params.url}` + "/")

            data = fs.readdirSync("./CLOUD/");  
 
            res.render("index", {
                message: "File uploaded successfully", 
                data: data, 
                status: "success",
                extensions: extensions,
                url: req.params.url
            })
        }
    }
});

app.post("/create/:url(*)", (req, res) => {
    const url = req.params.url; 
    const fileName = req.body.name;
    const dir = "./" + url + "/" +fileName;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    res.redirect("back");
});

app.get("/delete/file/:url(*)", (req, res) => {
    const url = req.params.url; 
    const dir = "./" + url;

    if (fs.existsSync(dir)){
        fs.unlinkSync(dir);
        console.log(`deleted ${dir}`);
    }

    res.redirect("back");
});

app.get("/delete/folder/:url(*)", (req, res) => {
    const url = req.params.url; 
    const dir = "./" + url;

    fs.rmdir(dir, { recursive: true }, (err) => {
        if (err) {
            throw err;
        }
    })
    console.log(`${dir} is deleted!`);

    res.redirect("back");
});

app.listen(3000);