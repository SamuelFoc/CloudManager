const mongoose      = require("mongoose");
const Schema        = mongoose.Schema;

const MovieSchema = new Schema({
    movieName: {
        type: String,
        required: true
    },
    revealYear: {
        type: Number,
        required: false
    },
    genre: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        required: false
    }
});

module.exports = MovieSchema