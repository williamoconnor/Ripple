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

	bigLocation.top = checkLatitude(Math.floor(latitude) + 2); // plus 2, -1 because we are at the lower edge of the square
	bigLocation.bottom = checkLatitude(Math.floor(latitude) - 1);
	bigLocation.left = checkLongitude(Math.floor(longitude) - 1);
	bigLocation.right = checkLongitude(Math.floor(longitude) + 2);

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