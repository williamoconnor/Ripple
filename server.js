var modeObj = require('./mode.js');
var mode = modeObj.mode;

// node modules
if (mode === 'test') {
	require('newrelic');
}
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var favicon = require("serve-favicon");
var cors = require('cors');


// routes
var dropRouter = require('./server/routes/dropRoutes');
var userRouter = require('./server/routes/userRoutes');
app.use(cors());

// middleware
var location = require('./server/middleware/location');

// database - local
if (mode == 'local'){
	mongoose.connect('mongodb://localhost/rippleTest');
	//static files
	app.use(express.static('client'));
	app.use(express.static('bower_components'));
}

// database - heroku test
else if (mode == 'test'){
	mongoose.connect('mongodb://heroku_xv125p2h:28idmqdlvkdlm5vanhuv3r6ki2@ds041593.mongolab.com:41593/heroku_xv125p2h');
	// static files
	console.log(path.join(process.env.PWD, 'client'))
	app.use(express.static(path.join(process.env.PWD, 'client')));
	app.use(express.static(path.join(process.env.PWD, 'bower_components')));
}

// database - heroku live
else if (mode == 'live'){
	mongoose.connect('mongodb://heroku_xv125p2h:28idmqdlvkdlm5vanhuv3r6ki2@ds041593.mongolab.com:41593/heroku_xv125p2h');
	// static files
	console.log(path.join(process.env.PWD, 'client'))
	app.use(express.static(path.join(process.env.PWD, 'client')));
	app.use(express.static(path.join(process.env.PWD, 'bower_components')));
}

// app
app.use('/api/drops', dropRouter);
app.use('/api/users', userRouter);

app.use(favicon(__dirname + '/favicon.ico'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/views/index.html');
});

app.get('/loaderio-9c4802eb1ac37895284308e7fcd7ded9.txt', function(req, res){
	res.sendFile(__dirname + '/client/loaderio-9c4802eb1ac37895284308e7fcd7ded9.txt');
});

// heroku
if (mode == 'test') {
	app.listen(process.env.PORT || 3000, function (){
		console.log('App running on port ' + process.env.PORT || 3000);
	});	
}

else if (mode == 'local') {
	app.listen(3000, function (){
		console.log('App running on port ' + 3000 + ' in ' + mode + ' mode.');
	});
}

module.exports = app;