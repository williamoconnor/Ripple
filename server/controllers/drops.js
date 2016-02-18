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
	 		res.set('Access-Control-Allow-Origin', '*');
	 		res.status(500).send(err);
	 	}
	 	else {
	 		// only want unique - handled with insertion
	 		res.set('Access-Control-Allow-Origin', '*');
	 		res.json(drops);
	 	}
	});
}

exports.createDrop = function(req, res) {
	console.log(req.body);

	// check if this drop has already been made in this area
	Drop.find({
		$and:[ {latitude_top: {$gte: req.body.latitude}}, {latitude_bottom: {$lte: req.body.latitude}},
		{longitude_left: {$lte: req.body.longitude}}, {longitude_right: {$gte: req.body.longitude}}, 
		{most_recent: true} ]
		
	}).exec(function(err, drops) {
		var same_id = drops.filter(function(drop){
			return drop.soundcloud_track_id === req.body.soundcloud_track_id;
		});
		if (same_id.length > 0) { // it's a redrop
			var drop = same_id[0];
			req.body.latitude = drop.latitude;
			req.body.longitude = drop.longitude;
			req.body.latitudeBottom = drop.latitude_bottom;
			req.body.latitudeTop = drop.latitude_top;
			req.body.longitudeLeft = drop.longitude_left;
			req.body.longitudeRight = drop.longitude_right;
			req.body.previousDropperIds = drop.previousDropperIds.push(req.body.userId);
			req.body.lastDropId = drop._id;
			redrop(req, res);
		}
		else { // new drop
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
				most_recent: true,
				merged: false
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
	});


}

exports.reDrop = function(req, res) {
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

	drop.save(function(err, new_drop) {
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
						// find overlappers
					Drop.find({
						$and:[ {latitude_top: {$gte: req.body.latitude}}, {latitude_bottom: {$lte: req.body.latitude}},
						{longitude_left: {$lte: req.body.longitude}}, {longitude_right: {$gte: req.body.longitude}}, 
						{most_recent: true} ]
						
					}).exec(function(err, drops){
						// if we has overlap, we need to merge the new one into the old one
						var drop_ids = drops.map(function(drop_found) {
							return drop_found._id;
						});
						Drop.update({_id: {"$in": drop_ids}}, {$set: {merged: true, merges: drop.merges.push(new_drop._id)}}, function(err, updated_drop){
							if (err) {
								res.status(500).send(err);
							}
							else {
						 		res.set('Access-Control-Allow-Origin', '*');
								res.json({drop: new_drop});
							}
						});

						var pointsResult = userController.givePointsById(req.body.previous_dropper_ids.concat(drop_ids), 10);
						var result = {points: pointsResult, drop: new_drop};
						if (pointsResult.result === "success") {
							res.json(result);
						}
						else {
							res.json(result);
						}

					});
					
				}
			});
				// get all of this soundcloud info from the client
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


