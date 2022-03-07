const fs        = require("fs");
const User      = require("../models/user");
const filer     = require("../services/fileServices");


const updateAndOpenMovieFolder = (url,res,req) => {
    const id = url.split("/")[0];
    const parentFolder = url.split("/").pop().split(".")[0];
    const content = fs.readdirSync(`${process.env.BASE_DIRECTORY}/${url}`);
    contentRaw = filer.removeExtensions(content);


    User.aggregate([
        {$match: {_id: id, "moviesFolders.parentFolder": parentFolder}},
        {$unwind: "$moviesFolders"},
        {$unwind: "$moviesFolders.movies"}
    ])


    // User.findOne(
    //     {
    //         _id: id,
    //         "moviesFolder.parentFolder": parentFolder
    //     }
    //     )
        // .sort({"movies.movieName": 1})
        User.aggregate([
            {$match: {_id: id, "moviesFolders.parentFolder": parentFolder}},
            {$unwind: "$moviesFolders"},
            {$unwind: "$moviesFolders.movies"}
        ])
        .then((result) => {
            console.log(result)
            const dbNames = result;

            updateObject = filer.intersectArrays(contentRaw, dbNames, parentFolder);

            if(updateObject.news.length === 0 && updateObject.unnecessary.length === 0){
                res.render("Cinema/cinema", {
                    movies: content,
                    id: id,
                    url: url,
                    info: result.movies
                });  
            } else if (updateObject.news.length !== 0){
                User.findOneAndUpdate(
                    { 
                        _id: id,
                        "moviesFolders.parentFolder": parentFolder
                    }, 
                    {
                        $push: { "moviesFolders.$[o].movies": {$each: updateObject.news } }
                    },
                    {
                        upsert: true
                    },
                    {
                        arrayFilters: [ {"o.parentFolder": parentFolder} ]
                    }
                    ).then(
                        console.log(`Folder and DB updated.`)
                    ).catch((err) => {
                        console.log(err)
                    });
                
                res.redirect("back");
            } else if (updateObject.unnecessary.length !== 0){
                updateObject.unnecessary.forEach( movie => {
                    User.findOneAndUpdate(
                        { 
                            _id: id,
                            "moviesFolders.parentFolder": parentFolder 
                        }, 
                        { 
                            $pull: { "moviesFolders.$[o].movies": {"movieName": movie.movieName} }
                        },
                        { arrayFilters: [ {"o.parentFolder": parentFolder} ]}
                        ).then(
                            console.log(`DB updating...`)
                        ).catch((err) => {
                            console.log(err)
                        });
                })
                console.log("DB updated...");
                res.redirect("back");
            }
        })
        .catch((err) => {
            console.log(err);
        }
    );
}


module.exports = {
    updateAndOpenMovieFolder
}
