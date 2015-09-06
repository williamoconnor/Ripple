var User = require('../models/user');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

exports.register = function(req, res){
	console.log(req.body);
	var user = new User({
		email: req.body.email,
		password: req.body.password,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
	});

	user.save(function (err){
		if (err){
			res.send(err);
		}
		else {
			// send email
			var options = {
			  auth: {
			    api_user: 'kwitheringto',
			    api_key: 'Glrz007009'
			  }
			}

			var client = nodemailer.createTransport(sgTransport(options));

			var email = {
			  from: 'williamboconnor@gmail.com',
			  to: user.email,
			  subject: 'Welcome to Ripple',
			  text: 'Welcome to Ripple!',
			  html: '<a href="http://localhost:3000/api/users/verify/' + user._id + '">Verfiy account</a>'
			};

			client.sendMail(email, function(err, info){
			    if (err ){
			      console.log(error);
			    }
			    else {
			      console.log('Message sent: ' + info.response);
			    }
			});
			res.status(201).json(user);
		}
	});
}

exports.changePassword = function (req, res) {
	User.update({ $and: [{ email: req.body.email }, { password: req.body.password }]}, { $set: { password: req.body.newPassword} }, function(err, user) {
		if (err) {
			res.send(err);
		}
		else {
			res.status(204).json(user);
		}
	});
}

exports.verifyUser = function (req, res) {
	User.findByIdAndUpdate(ObjectId(req.params.userId), { $set: { verified: true } }, function (err, user) {
		if (err) {
			res.send(err);
		}
		else {
			res.redirect("/#/verify/" + user._id)
		}
	});
}

exports.login = function (req, res){
	User.findOne({ $and: [{ email: req.body.email }, { password: req.body.passord }]}, function (err, user) {
		if (err) {
			res.send(err);
		}
		else if(user){
			if (user.verified === true) {
				res.json(user);
			}
			else {
				res.send('First verify account.'); // give option to resend email
			}
		}
		else {
			res.send("Login Failed");
		}
	});
}

exports.givePointsById = function (req, res) {
	User.findByIdAndUpdate(ObjectId(req.body.userId), { $inc: { points: req.body.points } }, function(err, user){
		if (err) {
			res.send(err);
		}
		else {
			res.json(user);
		}
	});
}

exports.getUserById = function(req, res) {
	User.findById(ObjectId(req.params.userId), function(err, user){
		if (err) {
			res.send(err);
		}
		else {
			res.json(user);
		}
	});
}
