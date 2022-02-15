const express           = require("express");
const session           = require("express-session");
const passport          = require("passport");
const mongoose          = require("mongoose");
const upload            = require("express-fileupload");
const path              = require("path");
const MongoStore        = require("connect-mongo");
const auth              = require("./security/secure-functions");
const sign              = require("./controllers/signIn");

//ROUTES REQUIRES
const baseRoutes        = require("./routes/baseCloudRoutes");
const cloudOperations   = require("./routes/cloudOperationsRoutes");
const adminRoutes       = require("./routes/adminRoutes");
const permissionRoutes  = require("./routes/permissionRoutes");

const app = express();

//Connection to local mongoDB
mongoose.connect("mongodb://localhost:27017/cloudAuth")
    .then((result) => {
        console.log("Connected to mongoDB...");
        app.listen(3000)
    })
    .catch((err) => console.log(err));

//JSON handler
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//ViewEngine
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, './views'));

//Passport
require("./security/passport-config");

//Sessions
app.use(
    session({
        secret: "some secret",
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/cloudAuth" }),
        cookie: {
            maxAge: 3600*24
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

//FileUpload
app.use(upload());

//FirstMeetRoutes
app.get("/signUp", (req, res) => {
    res.render("signUp", {message: ""});
});

app.post("/signUp", passport.authenticate("local", {failureRedirect: "back"}), (req, res) => {
    res.redirect(`/CLOUD`);
});

app.get("/logOut", (req, res) => {
    req.logout();
    console.log("User logged out");
    res.redirect("/signUp");
});

//This line is used just for the very
//first start of the app
app.post("/firstSignIn", (req, res) => {
    sign.first_sign_in(req, res);
})
app.use(auth.isThereAdmin);

//AskForPermission
app.use("/ask", permissionRoutes);

//Routes
app.use(auth.isLoggedIn);
app.get("/", (req, res) => res.redirect("/CLOUD"));
app.get("/upload(*)", (req, res) => res.redirect("/"));
app.use("/CLOUD", baseRoutes);
app.use("/heyCLOUD", cloudOperations);

//Admin
app.use(auth.isAdmin);
app.use("/admin", adminRoutes);