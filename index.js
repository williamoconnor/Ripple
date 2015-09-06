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

// database
mongoose.connect('mongodb://localhost/rippleTest');

// app
app.use('/api/drops', dropRouter);
app.use('/api/users', userRouter);

// static files
app.use(express.static('client'));
app.use(express.static('bower_components'));

app.use(favicon(__dirname + '/client/images/drop-icon.ico'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/views/index.html');
});

app.listen(3000, function (){
	console.log('App running on port 3000');
});

module.exports = app;