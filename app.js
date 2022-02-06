const express           = require("express");
const upload            = require("express-fileupload");
const path              = require("path");
const fs                = require("fs");

const filer             = require("./fileController");

const app = express();

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use(upload());

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, './views'));


app.get("/", (req, res) => {
    res.redirect("/CLOUD");
});

app.get("/CLOUD", (req, res) => {
    data = fs.readdirSync("./CLOUD");
    extensions = filer.readExtensions(data);
    res.render("index", 
        {
            message: "Welcome to your cloud storage", 
            data: data, 
            status: "primary",
            extensions: extensions,
            url: req.originalUrl,
        })
});

app.get("/download/:file", (req, res) => {
    var file = req.params.file;
    var fileLocation = path.join('./CLOUD',file);
    console.log(fileLocation);
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
    console.log(req.originalUrl)
})

app.post("/", (req, res) => {
    if(req.files){
        var file = req.files.file
        var fileName = file.name
        
        data = fs.readdirSync("./CLOUD");
        extensions = filer.readExtensions(data);
        
        if(data.filter(file => file === fileName)){
            res.render("index",
            {
                message: "File with this name already exists", 
                data: data, 
                status: "warning",
                extensions: extensions
            })
        } else {
            file.mv("./CLOUD/" + fileName, (err) => {
                if(err){
                    res.send(err)
                }
                else{
                    res.render("index",
                    {
                        message: "File uploaded successfully", 
                        data: data, 
                        status: "success",
                        extensions: extensions
                    })
                }
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

app.listen(26000);