// Init Express + Mongoose
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
require('dotenv/config');

// Connect to db
mongoose.connect('mongodb://mongo_db:27017')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB')
});

// EJS setup
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set public folder
console.log(path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));

// Set uploads folder
console.log(path.join(__dirname, 'uploads'));
app.use(express.static(path.join(__dirname, 'uploads')));

// Set routes
var pages = require('./routes/pages.js');
app.use('/', pages);
app.use('/add-item', pages);
app.use('/add-auction', pages);

// Start the server
var port = 3000;
app.listen(port, function() {
    console.log('Server started on port ' + port);
});