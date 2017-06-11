var modeObj = require('../../mode.js');
var mode = modeObj.mode;

var User = require('../models/user');
var ResetToken = require('../models/resetPasswordToken')
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var bcrypt = require('bcrypt-nodejs');
var randomstring = require("randomstring");
var Drop = require('../models/drop');
var sendGridInfo = require('./sendGridInfo.js');
var rankings = require('./rankings.js');

exports.register = function(req, res){
	var user = new User({
		username: req.body.email,
		email: req.body.email,
		password: req.body.password,
		latitude: req.body.latitude,
		longitude: req.body.longitude
	});

	user.save(function (err){
		if (err){
			console.log("THIS IS THE ERROR: " + err);
			res.status(400).json(err);
		}
		else {
			// send email
			var options = {
			  auth: {
			    api_user: sendGridInfo.options.api_user,
			    api_key: sendGridInfo.options.api_key
			  }
			};

			var client = nodemailer.createTransport(sgTransport(options));
			var baseURL = 'http://ripplemusicapp.herokuapp.com/api/users/verify/';
			if (mode == 'local') {
				baseURL = 'http://localhost:3000/api/users/verify/';
				//'http://williams-macbook-pro-2.local:3000/api/users/verify/';
			} 

			var email = {
			  from: sendGridInfo.options.fromEmail,
			  to: user.email,
			  subject: 'Welcome to Ripple',
			  text: 'Welcome to Ripple!',
			  html: '<p>Sign back in after you <a href="' + baseURL + user._id + '">verfiy account</a></p>'
			};

			client.sendMail(email, function(err, info){
			    if (err ){
			      console.log(err);
			    }
			    else {
			      console.log('Message sent: ' + info.response);
			    }
			});
	 		res.set('Access-Control-Allow-Origin', '*');
			res.status(201).json(user);
		}
	});
};

exports.changePassword = function (req, res) { // actually changes the password of the user
	console.log(req.body);
	User.update({ $and: [{_id: req.body.userId}, { email: req.body.email }]}, { $set: { password: req.body.password} }, function(err, result) {
		if (err) {
			res.status(400).send(err);
		}
		else {
	 		res.set('Access-Control-Allow-Origin', '*');
			res.status(200).json(result);
		}
	});
}

exports.forgotPassword = function (req, res) { // generates the link that gets sent in the email
	var token = randomstring.generate();
	User.findOne({ email: req.body.email }, function(err, user){
		if (err) {
			console.log(err);
			res.send(err);
		}
		else {
			if (user) {
				var userToken = new ResetToken ({
					user_id: user._id,
					token: token
				});
				userToken.save(function(err){
					if (err) {
						console.log(err);
						res.status(500).json(err);
					}
					else {
						// send email
						var options = {
						  auth: {
						    api_user: sendGridInfo.options.api_user,
						    api_key: sendGridInfo.options.api_key
						  }
						}

						var client = nodemailer.createTransport(sgTransport(options));
						var baseURL = 'http://ripplemusicapp.herokuapp.com/api/users/new-password/';
						if (mode == 'local') {
							baseURL = 'http://localhost:3000/api/users/new-password/';
							//'http://williams-macbook-pro-2.local:3000/api/users/verify/';
						} 

						var email = {
						  from: sendGridInfo.options.fromEmail,
						  to: req.body.email,
						  subject: 'Ripple Password Reset',
						  text: 'Ripple Password Reset',
						  html: '<p>Follow link to <a href="' + baseURL + token + '">reset password</a></p>'
						};

						client.sendMail(email, function(err, info){
						    if (err){
						      console.log(err);
						    }
						    else {
						      console.log('Message sent: ' + info.response);
						    }
						});

				 		res.set('Access-Control-Allow-Origin', '*');
						res.status(200).json({result:"success", message:"email sent"});
					}
				});
			}
			else {
				res.json({result:"failed", message:"no user with that email"});
			}
		}
	});
		
}

exports.resetPassword = function(req, res) { // renders the page with the form to reset the password
	// find token in database, make sure it is valid. if so, render page
	ResetToken.findOne({ token: req.params.token }, function (err, token) { // find the token, check the time. Return the user, so we can say 'wrong user for this token'
		var now = Date.now();
		var diff = Math.abs(now - token.created_at);
		diff = diff / (1000.0 * 60 * 60 * 24);
		console.log(diff);
		if (diff > 1) { // expired
			res.redirect("/#/expired")
		}
		else { // good - redirect to form with user_id in url with token
			res.redirect("/#/" + token.user_id + "/" + token.token)
		}
	});

	// the page will link to change password
}

exports.verifyUser = function (req, res) {
	User.findByIdAndUpdate(ObjectId(req.params.userId), { $set: { verified: true } }, function (err, user) {
		if (err) {
	 		res.set('Access-Control-Allow-Origin', '*');
			res.status(500).send(err);
		}
		else {
			res.redirect("/#/verify/" + user._id)
		}
	});
}

exports.login = function (req, res){
	// return the user's drops and shit
	console.log(req.body);
	User.findOne({ email: req.body.email }, function (err, user) {
		if (err) {
			console.log(err);
	 		res.set('Access-Control-Allow-Origin', '*');
			res.status(500).json(err);
		}
		else if(user && bcrypt.compareSync(req.body.password, user.password)){
			console.log(user);
			if (user.verified === true) {
				console.log('Yay!');
				// query for drops
				Drop.count({user_id: user._id}).
				exec(function(err, dropsCount){
					if (err) {
						res.status(500).send(err);
						console.log(err);
					}
					else {
						Drop.count({user_id: user._id}).
						exec(function(err,droppedCount){
							if (err) {
								res.status(500).send(err);
								console.log(err);
							}
							else {
								res.set('Access-Control-Allow-Origin', '*');
								res.json({result: "success", user: user, drops: dropsCount, dropped: droppedCount});
							}
						});

					}
				});
			}
			else {
				console.log('shit');
	 			res.set('Access-Control-Allow-Origin', '*');
				res.json({result: 'First verify account.'}); // give option to resend email
			}
		}
		else {
			console.log('damn');
	 		res.set('Access-Control-Allow-Origin', '*');
			res.json({result: "Login Failed. Wrong credentials"});
		}
	});
}

exports.givePointsById = function (req, res) {
// exports.givePointsById = function(userIds, points) {
	// compute points here
	var rank = rankings.compute(req.body.points);
	User.findByIdAndUpdate({_id: {"$in":req.body.userIds}}, { $inc: { points: req.body.points }, $set: { rank: rank } }, function(err, users){
		if (err) {
			// res.status(500).send(err);
			return {result: "failure", error: err};
		}
		else {
	 		// res.set('Access-Control-Allow-Origin', '*');
			// res.json({result: "success", user: user});
			return {result: "success", users: users};
		}
	});
}

exports.attributePointsToUsers = function(userIds, points, callback) {
		// compute points here
	var rank = rankings.compute(points);
	User.findByIdAndUpdate({_id: {"$in":userIds}}, { $inc: { points: points }, $set: { rank: rank } }, function(err, users){
		if (err) {
			// res.status(500).send(err);
			callback({result: "failure", error: err});
		}
		else {
	 		// res.set('Access-Control-Allow-Origin', '*');
			// res.json({result: "success", user: user});
			callback({result: "success", users: users});
		}
	});
}

exports.attributePointsToUser = function(userId, points, callback) {
		// compute points here
	var rank = rankings.compute(points);
	User.findByIdAndUpdate({_id: userId}, { $inc: { points: points }, $set: { rank: rank } }, function(err, user){
		if (err) {
			// res.status(500).send(err);
			callback({result: "failure", error: err});
		}
		else {
	 		// res.set('Access-Control-Allow-Origin', '*');
			// res.json({result: "success", user: user});
			callback({result: "success", user: user});
		}
	});
}

exports.getUserById = function(req, res) {
	User.findById(ObjectId(req.params.userId), function(err, user){
		if (err) {
			res.status(500).send(err);
		}
		else {
			res.json({result: "success", user: user});
		}
	});
}
