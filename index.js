// node modules
var express = require('express');
var app = express();
var path = require('path');

// routes
var dropRouter = require('./routes/drops');

// middleware
var location = require('./middleware/location');

// database
var databaseUrl;
var collections;
//var db = require('mongojs').connect(databaseUrl, collections);

// app
app.use(express.static('views'));
app.use('/drops', location.getListenerLocation, dropRouter);

app.get('/', function(req, res) {
	res.sendFile(__dirname + 'views/index.html');
});

app.listen(3000);

module.exports = app;