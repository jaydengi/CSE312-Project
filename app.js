var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

// Connect to db
mongoose.connect('mongodb://mongo_db:27017')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB')
});

// Init app
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set routes
var pages = require('./routes/pages.js');

app.use('/', pages);

// Start the server
var port = 3000;
app.listen(port, function() {
    console.log('Server started on port ' + port);
});

