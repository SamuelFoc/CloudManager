const fs            = require("fs");
const filer         = require("../services/fileServices");
const User          = require("../models/user");
const cinema        = require("../services/cinemaServices");

const open_cinema = (req, res) => {
    const url = req.params.url;
    
    cinema.updateAndOpenMovieFolder(url,res,req);
}


const upload_movie = (req, res) => {
    const movieName = req.body.movieName;
    const url = req.params.url;
    const id = url.split("/").slice(0,1);
    const parentFolder = url.split("/").pop();
    const file = req.files.file;
    const extension = file.name.split(".").pop();

    let data = fs.readdirSync(`${process.env.BASE_DIRECTORY}/${req.params.url}`);
    let match = data.filter((file) => {
        return file === movieName
    });

    if (match.length !== 0){
        console.log("matched")
        res.redirect(`back`)
    } else {
        filer.uploadFileToDirectory(file, `${process.env.BASE_DIRECTORY}/${req.params.url}/`);
        console.log(`"File: ${movieName} was saved to: ${process.env.BASE_DIRECTORY}/${req.params.url}/`);

        const currPath = `${process.env.BASE_DIRECTORY}/${req.params.url}/${file.name}`;
        const newPath = `${process.env.BASE_DIRECTORY}/${req.params.url}/${movieName}.${extension}`;

        fs.rename(currPath, newPath, function(err) {
            if (err) {
            console.log(err)
            } else {
            console.log("Video successfully added to database.")
            }
        })

        User.findOneAndUpdate(
            { 
                _id: id,
                "movies.parentFolder": parentFolder
             }, 
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
    const url = req.params.url;
    const id = url.split("/")[0];
    const folderName = url.split("/").pop();
    const dbName = req.params.dbName;
    const fileName = req.params.movieName;
    const dir = `${process.env.BASE_DIRECTORY}/${url}/${fileName}`;
    
    if (fs.existsSync(dir)){
        fs.unlinkSync(dir);
        console.log(dir + "deleted");
    }

    User.findOneAndUpdate(
        {
            _id: id,
            "moviesFolders.parentFolder": parentFolder,
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

const open_videoPlayer = (req, res) => {
    const videoDbName = req.params.dbName;
    const id = req.params.path.split("/")[0];
    console.log(videoDbName);

    User.findOne(
        {
            _id: id,
            "movies.movieName": `${videoDbName}`
        },
        {
            "movies.$": 1
        } 
        )
        .then((result) => {
            const movie = result.movies[0];
            res.render("Cinema/screen", {
                path: req.params.path,
                name: movie.movieName,
                genre: movie.genre,
                createdAt: movie.revealYear,
                rating: movie.rating
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

const play_video = (req, res) => {
  // Ensure there is a range given for the video
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  const path = `${process.env.BASE_DIRECTORY}/${req.params.path}`

  // get video stats (about 61MB)
  const videoPath = path;
  const videoSize = fs.statSync(path).size;

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
    "Content-Type": "video/avi",
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
    play_video,
    upload_movie,
    delete_movie,
    rename_movie,
    open_videoPlayer
}