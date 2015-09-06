var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bodyJson = bodyParser.json();
var dropsController = require('../controllers/drops');
var location = require('../middleware/location.js');

// routes start with /api/drops

router.route('/')
	.get(function(req, res){
		dropsController.getDrops(req, res);
	});

router.route('/create')
	.post(bodyJson, location.dropLocation, function(req, res){
		dropsController.createDrop(req, res);
	});

router.route('/redrop')
	.post(bodyJson, location.dropLocation, function(req, res){
		dropsController.reDrop(req, res);
	});

router.route('/:userId')
	.get(function(req, res){
		dropsController.getDropsForUser(req, res);
	});
	
module.exports = router;
