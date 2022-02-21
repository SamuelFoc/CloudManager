const mongoose      = require("mongoose");
const MovieSchema   = require("./movie");
const Schema        = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: String,
        default: "false"
    },
    movies: {
        type: [MovieSchema],
        default: []
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User