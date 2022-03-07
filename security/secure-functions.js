const User          = require("../models/user");

function isThereAdmin(req, res, next){
    User.findOne({ isAdmin: "true"}, (err, exists) => {
        if(exists){
            if(req.session.viewCount < 2){
                console.log("There already is Admin!")
            }
            next()
        } else {
            console.log("There is no Admin yet!")
            res.render("signIn");
        }
    })
}

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        if (req.session.viewCount){
            req.session.viewCount++;
        } else {req.session.viewCount = 1}
        return next()
    } else {
        console.log("Access denied...")
        res.redirect("/signUp")
    }
}

function isLoggedOut(req, res, next){
    if (req.isAuthenticated()){
        console.log("User already loged in")
        res.redirect("/home/admin");
    } else {
        console.log("User is not logged in")
        next()
    }
}

function isAdmin(req, res, next){
    if(req.session.passport){
        User.find({_id: req.session.passport.user}, (err, result) => {
            if (result[0].isAdmin){
                console.log("Admin authenticated")
                next()
            } else {
                console.log("An attempt at unauthorized access")
                res.redirect("/CLOUD")
            }
        })
    } else {
        res.render("signUp", {message: new(Date)})
    }
    
}


module.exports = {
    isLoggedIn,
    isLoggedOut,
    isAdmin,
    isThereAdmin
}