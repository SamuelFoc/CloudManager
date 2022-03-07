const bcrypt            = require("bcrypt");
const User 				= require("../models/user");
const fs				= require("fs");


const open_signIn = (req, res) => {
	res.render("signIn");
}

const first_sign_in = (req, res) => {
	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err);
		bcrypt.hash(`${req.body.password}`, salt, function (err, hash) {
			if (err) return next(err);
			
			const newUser = new User({
				email: req.body.email,
                password: hash,
				isAdmin: req.body.admin
			});

			console.log(`First user named ${req.body.email} saved at ${new Date()}`);

			newUser.save().then((user) => {
				const dirName = user._id.toString()
				if (!fs.existsSync("CLOUD")){
					fs.mkdirSync("CLOUD");
				}
				fs.mkdirSync(`${process.env.BASE_DIRECTORY}/${dirName}`);
			})
		});
	});

	res.redirect("signUp");
}

const sign_in = (req, res) => {
    const exists = User.exists({ email: `${req.body.email}` });

	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err);
		bcrypt.hash(`${req.body.password}`, salt, function (err, hash) {
			if (err) return next(err);
			
			const newUser = new User({
				email: req.body.email,
                password: hash,
				isAdmin: req.body.admin
			});

			console.log(`User named ${req.body.email} saved at ${new Date()}`);

			newUser.save().then((user) => {
				const dirName = user._id.toString()
				fs.mkdirSync(`${process.env.BASE_DIRECTORY}/${dirName}`)
			})
		});
	});

	res.redirect("signUp");
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

const sign_in_randomly = (req, res) => {
	const email = req.body.email;
    const exists = User.exists({ email: email });
	const randPassword = makeid(8);
	
	if (exists){
		console.log(`User with email: ${email} already exists..`);
		return(null);
	} else {
		bcrypt.genSalt(10, function (err, salt) {
			if (err) return next(err);
			bcrypt.hash(`${randPassword}`, salt, function (err, hash) {
				if (err) return next(err);
				
				var isAdminInfo;
				if(req.body.isAdmin){
					isAdminInfo = req.body.isAdmin;
				} else {
					isAdminInfo = false;
				}
				console.log(isAdminInfo);
				const newUser = new User({
					email: req.body.email,
					password: hash,
					isAdmin: isAdminInfo
				});
	
				console.log(`User named ${email} saved at ${new Date()}`);
	
				newUser.save().then((user) => {
					const dirName = user._id.toString()
					fs.mkdirSync(`${process.env.BASE_DIRECTORY}/${dirName}`)
				})

				return {randPassword, email}
			});
		});
	}

}

module.exports = {
    sign_in,
	open_signIn,
	sign_in_randomly,
	first_sign_in
}