const fs            = require("fs");
const filer         = require("../services/fileServices");
const User          = require("../models/user");


const open_cinema = (req, res) => {
    const id = req.params.url.split("/").slice(0,1);
    const content = fs.readdirSync(`./CLOUD/${req.params.url}`);

    User.findOne(
    {
        _id: id
    }
    )
    .then((result) => {
        res.render("Cinema/cinema", {
            movies: content,
            id: id,
            url: req.params.url,
            info: result.movies
        });
    })
    .catch((err) => {
        console.log(err);
    });
}

const upload_movie = (req, res) => {
    const movieName = req.body.movieName;
    const id = req.params.url.split("/").slice(0,1);
    const file = req.files.file;

    let data = fs.readdirSync(`./CLOUD/${req.params.url}`);
    let match = data.filter((file) => {
        return file === movieName
    });

    if (match.length !== 0){
        console.log("matched")
        res.redirect(`back`)
    } else {
        filer.uploadFileToDirectory(file, "./CLOUD/"+`${req.params.url}` + "/");
        console.log("File: " + `${movieName}` + " was saved to: " + "./CLOUD/"+`${req.params.url}` + "/");

        User.findOneAndUpdate(
            { _id: id }, 
            { $push: { movies: req.body }}
            )
            .then(
                console.log(`Movie with name: ${req.body.movieName} created succesfully.`),
            )
            .catch((err) => {
                 console.log(err);
             });

        res.redirect(`back`)
    }
}

const delete_movie = (req, res) => {
    const id = req.params.url.split("/")[0];
    const folderName = req.params.url.split("/")[1];
    const dbName = req.params.dbName;
    const fileName = req.params.movieName;
    const dir = `./CLOUD/${id}/${folderName}/${fileName}`;
    
    if (fs.existsSync(dir)){
        fs.unlinkSync(dir);
        console.log(dir + "deleted");
    }

    User.findOneAndUpdate(
        {
            _id: id,
            "movies.movieName": `${dbName}`
        },
        {
            $pull: { movies: {"movieName": `${dbName}`} }
        }
    )
        .then(result => {
            res.redirect("back");
            console.log(`Movie with name: ${dbName} deleted succesfully.`)
        })
        .catch(err => {
            console.log(err);
        })
}

const rename_movie = (req, res) => {
    const id = req.params.url.split("/")[0];
    const newName = req.body.name;
    const oldName = req.params.dbName;

    User.findOneAndUpdate(
        {
            _id: id,
            "movies.movieName": `${oldName}`
        },
        {
            $set: { "movies.$[o].movieName": `${newName}`}
        },
        {
            arrayFilters: [ {"o.movieName": oldName} ]
        }
    )
        .then(result => {
            console.log(`Movie with name: ${oldName} was successfully renamed to ${newName}.`)
        })
        .catch(err => {
            console.log(err);
        })

    res.redirect("back");
}

const play_movie = (req, res) => {
    const id = req.params.url.split("/")[0];
    const file = req.params.url.split("/")[1];
    const movieName = req.params.movieName;

    const path = `../CLOUD/${id}/${file}/${movieName}`;

    res.render("Cinema/screen", {
        videoPath: `/cinema/video/${path}`
    });
}

const player_stream = (req, res) => {
        // Ensure there is a range given for the video
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  const pathVideo = req.params.path;

  // get video stats (about 61MB)
  const videoPath = pathVideo;
  const videoSize = fs.statSync(pathVideo).size;

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
}

module.exports = {
    open_cinema,
    play_movie,
    upload_movie,
    delete_movie,
    rename_movie,
    player_stream
}