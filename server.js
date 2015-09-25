// node modules
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var favicon = require("serve-favicon");

// routes
var dropRouter = require('./server/routes/dropRoutes');
var userRouter = require('./server/routes/userRoutes');

// middleware
var location = require('./server/middleware/location');

// database - local
 mongoose.connect('mongodb://localhost/rippleTest');

// database - heroku test
// mongoose.connect('mongodb://heroku_xv125p2h:28idmqdlvkdlm5vanhuv3r6ki2@ds041593.mongolab.com:41593/heroku_xv125p2h');

// app
app.use('/api/drops', dropRouter);
app.use('/api/users', userRouter);

// local - static files
app.use(express.static('client'));
app.use(express.static('bower_components'));

// heroku - static files
// console.log(path.join(process.env.PWD, 'client'))
// app.use(express.static(path.join(process.env.PWD, 'client')));
// app.use(express.static(path.join(process.env.PWD, 'bower_components')));

app.use(favicon(__dirname + '/favicon.ico'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/views/index.html');
});

// app.listen(process.env.PORT || 3000, function (){
// 	console.log('App running on port ' + process.env.PORT);
// });

app.listen(3000, function (){
	console.log('App running on port ' + 3000);
});

module.exports = app;