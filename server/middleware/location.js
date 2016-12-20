// handles all location related aspects of the application

exports.dropLocation = function(req, res, next) {
	var location = getSurroundingSquares(req.body.latitude, req.body.longitude);

	req.body.latitudeTop = location.top;
	req.body.latitudeBottom = location.bottom;
	req.body.longitudeLeft = location.left;
	req.body.longitudeRight = location.right;

	next();
}

// function getSquare(latitude, longitude){
// 	var location = {};

// 	location.bottom = Math.floor(latitude);
// 	location.top = Math.floor(latitude) + 1;
// 	location.left = Math.floor(longitude);
// 	location.right = Math.floor(longitude) + 1;

// 	return location;
// }

exports.getLocation = function(req, res, next) {
	// get the user's location
	//assign to req.body		
	if(navigator.geolocation)
		{
			var location = navigator.geolocation.getCurrentPosition(showPosition);

	    		document.getElementById("location").style.display = 'none';
		} 
		else {
	  		alert ("Couldn't get location. Sorry bitch");
		}

	next();
}

function getSurroundingSquares(latitude, longitude) {
	var bigLocation = {};

	// 1 deg lat = 69 miles
	// 1 mile = 0.01449275362 deg lat
	var mileLat = 0.01449275362;

	// 1 deg lng = 54.6 miles
	// 1 mile = 0.01831501832
	var mileLng = 0.01831501832;

	var radiusMiles = 5;

	bigLocation.top = checkLatitude(latitude + (radiusMiles * mileLat));
	bigLocation.bottom = checkLatitude(latitude - (radiusMiles * mileLat));
	bigLocation.left = checkLongitude(longitude - (radiusMiles * mileLng));
	bigLocation.right = checkLongitude(longitude + (radiusMiles * mileLng));

	return bigLocation;
}

function checkLongitude(longitude) {
	if (longitude > 180) {
		return longitude - 360;
	}
	else if (longitude < -180) {
		return longitude + 360
	}
	return longitude;
}

function checkLatitude(latitude) {
	if (latitude > 90) {
		return latitude - 180;
	}
	else if (latitude < -90) {
		return latitude + 180;
	}
	return latitude;
}