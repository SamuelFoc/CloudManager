const mongoose      = require("mongoose");
const MovieFolderSchema   = require("./movieFolder");
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
        type: Boolean,
        default: false
    },
    moviesFolders: {
        type: [ MovieFolderSchema ],
        default: []
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User

