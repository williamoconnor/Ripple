// handles all location related aspects of the application

exports.getListenerLocation = function(req, res, next) {
	console.log('middleware is cool');
	
	next();
}