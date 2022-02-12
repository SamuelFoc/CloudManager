const User 				= require("../models/user");
const fs				= require("fs");
const mongoose			= require("mongoose");
const mailer            = require("../controllers/mailControl");


const open_admin = (req, res) => {
    User.find({}, (err, users) => {
        var dates = [];
        var isAdmin = [];
        users.forEach(user => {
            id = user._id.toString();
            dates.push(fs.statSync(`./CLOUD/${id}`));
            isAdmin.push(user.isAdmin);
        });
        res.render("adminPage", {users: users,dates: dates, isAdmin: isAdmin})
    });
}

const delete_user = (req, res) => {
    const id = req.params.id;
    User.findOneAndDelete({_id: id}, (err, user) => {
        console.log(`User ${user.email} deleted`);
        res.redirect("back");
    }) 
}

const warn_user = (req, res) => {
    const id = req.params.id;
    const message = req.body.message;
    User.find({_id: id}, (err, user) => {
        var email = user[0].email;
        mailer.sendWarnMail(email, message)
        res.redirect("back")
    }); 
}

module.exports = {
    open_admin,
    delete_user,
    warn_user
}