var Drop = require('../models/drop');
var userController = require('./users');

exports.getDrops = function(req, res) {
	Drop.find({
		$and:[ {latitude_top: {$gte: req.query.latitude}}, {latitude_bottom: {$lte: req.query.latitude}},
		{longitude_left: {$lte: req.query.longitude}}, {longitude_right: {$gte: req.query.longitude}}, 
		{most_recent: true} ]
		
	}).sort({created_at: -1}).limit(25).exec(
	  function (err, drops) {
	 	if (err) {
	 		res.status(500).send(err);
	 	}
	 	else {
	 		res.set('Access-Control-Allow-Origin', '*');
	 		res.json(drops);
	 	}
	});
}

exports.createDrop = function(req, res) {
	console.log(req.body);
	var drop = new Drop({
		user_id: req.body.userId,
		stream_url: req.body.streamUrl, 
		soundcloud_track_id: req.body.soundcloudTrackId,
		name: req.body.trackName,
		artist: req.body.artist,
		artwork_url: req.body.artworkUrl,
		streamable: req.body.streamable,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		latitude_bottom: req.body.latitudeBottom,
		latitude_top: req.body.latitudeTop,
		longitude_left: req.body.longitudeLeft,
		longitude_right: req.body.longitudeRight,
		previous_dropper_ids: [req.body.userId],
		most_recent: true
	});

	drop.save(function(err) {
		if (err) {
			res.status(500).send(err);
		}
		else {
			console.log(drop);
			res.json(drop);
		}
	});
}

exports.reDrop = function(req, res) {
	// get all of this soundcloud info from the client
	var drop = new Drop({
		user_id: req.body.userId,
		stream_url: req.body.streamUrl, 
		soundcloud_track_id: req.body.soundcloudTrackId,
		name: req.body.trackName,
		artist: req.body.artist,
		artwork_url: req.body.artworkUrl,
		streamable: req.body.streamable,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		latitude_bottom: req.body.latitudeBottom,
		latitude_top: req.body.latitudeTop,
		longitude_left: req.body.longitudeLeft,
		longitude_right: req.body.longitudeRight,
		last_drop: req.body.lastDropId,
		previous_dropper_ids: req.body.previousDropperIds,
		most_recent: true
	});

	drop.save(function(err) {
		if (err) {
			res.status(500).send(err);
			console.log(req.body.lastDropId);
		}
		else {	
			Drop.findByIdAndUpdate(req.body.lastDropId, { most_recent: false }, function(err, update){
				if (err) {
					res.status(500).send(err);
					console.log(err);
				}
				else {
					console.log(update);
					var pointsResult = userController.givePointsById(req.body.previous_dropper_ids[1], 10);
					if (pointsResult.result === "success") {
						res.json({drop: drop});
					}
					else {
						var result = {points: pointsResult, drop: drop};
						res.json(result);
					}
				}
			});
		}
	});
}

exports.getDropsForUser = function(req, res) {
	Drop.find({user_id: req.params.userId}).sort({created_at: -1}).limit(25).
		exec(function(err, drops){
			if (err) {
				res.status(500).send(err);
				console.log(err);
			}
			else {
				res.json(drops);
			}
		});
}
