var express = require('express');
var bodyParser = require("body-parser");
var path = require('path');
const mongoose = require('mongoose');
var Schema = mongoose.Schema
var fs = require('fs');
require('dotenv/config');

// Connect to db
mongoose.connect('mongodb://mongo_db:27017')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB')
});

// Init app
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set routes
var pages = require('./routes/pages.js');

var multer = require('multer');
  
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(path.join(__dirname, 'uploads'))
        cb(null, path.join(__dirname, 'uploads'))
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
  
var upload = multer({ storage: storage });

var imgModel = require('model');

app.use('/', pages);

app.get('/item-added', (req, res) => {
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('items', { items: items });
        }
    });
});

app.post('/item-added', upload.single('image'), (req, res, next) => {
    console.log('req has ', req.body)
    var obj = {
        name: req.body.itemname,
        price: req.body.price,
        description: req.body.description,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.body.upload)),
            contentType: 'image/png'
        }
    }
    imgModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect('/items');
        }
    });
});

// app.post('/item-added', function(req,res) {
//     var name = req.body.itemname;
//     var price = req.body.price;
//     var description = req.body.description;
//     var imagefile = req.body.imagefile;
  
//     var item = {
//         "name": name,
//         "price":price,
//         "description":description,
//         "image":imagefile
//     }
//     db.collection('Items').insertOne(item,function(err, collection){
//         if (err) throw err;
//         console.log(item);
//         console.log("Item inserted Successfully");     
//     });
//     return res.redirect('/items');
// })

// Start the server
var port = 3000;
app.listen(port, function() {
    console.log('Server started on port ' + port);
});