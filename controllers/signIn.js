const bcrypt            = require("bcrypt");
const User 				= require("../models/user");
const fs				= require("fs");
const mongoose			= require("mongoose")

const open_signIn = (req, res) => {
	res.render("signIn", {code: "You dont have code"});
}

const sign_in = (req, res) => {
    const exists = User.exists({ email: `${req.body.email}` });
	console.log(req.body)
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
				fs.mkdirSync(`./CLOUD/${dirName}`)
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
	console.log(req.body)
	const email = req.body.email;
    const exists = User.exists({ email: email });
	const randPassword = makeid(8);
	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err);
		bcrypt.hash(`${randPassword}`, salt, function (err, hash) {
			if (err) return next(err);
			
			const newUser = new User({
				email: req.body.email,
                password: hash,
				isAdmin: req.body.admin
			});

			console.log(`User named ${email} saved at ${new Date()}`);

			newUser.save().then((user) => {
				const dirName = user._id.toString()
				fs.mkdirSync(`./CLOUD/${dirName}`)
			})
		});
	});

	return {randPassword, email}
}

module.exports = {
    sign_in,
	open_signIn,
	sign_in_randomly
}