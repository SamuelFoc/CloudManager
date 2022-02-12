const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy
const bcrypt        = require("bcrypt")
const User          = require("../models/user")

function verifyCallback(username, password, done){
    User.findOne({email: username}, (err, user) => {
        if (err){return done(err);}
        if (!user){return done(null, false, console.log("Incorrect username."))}

        bcrypt.compare(password, user.password, (err, res) => {
            if (err) return done (err);

            if (res === false){return done(null, false, console.log("Incorrect password."))}
            
            return done(null, user);
        });
    });
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});
    
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

