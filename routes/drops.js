var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlEncoded = bodyParser.urlencoded({extended: false});
var dropsController = require('../controllers/drops');

router.route('/')
	.get(function(req, res){
		var drops = dropsController.getDrops();
		res.json(drops);
	})

module.exports = router;
