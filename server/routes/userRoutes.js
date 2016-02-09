var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bodyJson = bodyParser.json();
var encryptPass = require('../middleware/encrypt_pass');
var validEmail = require('../middleware/validateEmail');
var usersController = require('../controllers/users');
var passport = require('passport');

// routes start with /api/users

router.route('/register')
	.post(bodyJson, validEmail, encryptPass, function(req, res){
		usersController.register(req, res);
	});

router.route('/reset-password') // actually changes the password of the user
	.post(bodyJson, encryptPass, function(req, res){
		usersController.changePassword(req, res);
	});

router.route('/verify/:userId')
	.get(function(req, res){
		usersController.verifyUser(req, res);
	});

router.route('/credit')
	.post(bodyJson, function(req, res){
		usersController.givePointsById(req, res);
	});

router.route('/login')
	.post(bodyJson, function(req, res){
		usersController.login(req, res);
	});

router.route('/:userId')
	.get(function(req, res){
		usersController.getUserById(req, res);
	});

router.route('/forgot-password') // generates the link that gets sent in the email
	.post(bodyJson, function(req, res){
		usersController.forgotPassword(req, res);
	})

router.route('/new-password/:token') // renders the page with the form to reset the password
	.get(function(req, res){
		usersController.resetPassword(req, res);
	});


module.exports = router;