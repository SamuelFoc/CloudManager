const mongoose      = require("mongoose");
const Schema        = mongoose.Schema;
const MovieSchema   = require("./movie");

const MovieFolderSchema = new Schema({
    parentFolder: {
        type: String,
        required: true
    },
    movies: {
        type: [MovieSchema],
        required: false
    }
});

module.exports = MovieFolderSchema
