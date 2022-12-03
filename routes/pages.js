var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var mongoose = require('mongoose');
var multer = require('multer');
var crypto = require('crypto');
require('dotenv/config');

// Item schema
var itemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    img: String
    // img:
    // {
    //     data: Buffer,
    //     contentType: String
    // }
});
itemModel = mongoose.model('item', itemSchema);

//Login Schema
const loginSchema = new mongoose.Schema({
    username: String,
    salt: String,
    password: String
});
loginModel = mongoose.model('login', loginSchema);

// Multer setup
var upload = multer ({
    storage : multer.diskStorage ({
        destination: (req, file, cb)=>{
            cb (null, '/usr/src/app/uploads')
        },
        filename : function (req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
    })
})

// Homepage
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Home'
    });
});

// Item Listings Page
router.get('/items', function(req, res) {
    itemModel.find()
        .then(function(doc){
            res.render('items', {
                title: 'Item Listings',
                item : doc
            })
        })
});

// Shopping Cart Page
router.get('/shopping-cart', function(req, res) {
    res.render('shoppingcart', {
        title: 'Shopping Cart'
    });
});

// Add Item Page
router.get('/add-item', function(req, res) {
    res.render('additem', {
        title: 'Add Item'
    });
});

router.post('/post', upload.single('image'), (req, res) => {
    console.log("file:", req.file);
    var temp = new itemModel();
    temp.name = req.body.name;
    temp.price = req.body.price;
    temp.description = req.body.description;
    temp.img = req.file.filename;
    temp.save((err, doc)=>{
        if (!err) {
            console.log("Item saved successfully");
            res.redirect('/items');
        }
        else {
            console.log(err);
        }
    })
});

// Registration Page
router.get('/register', function(req, res) {
    res.render('register', {
        title: 'Register'
    });
});

router.post('/register', urlencodedParser, function(req, res) {
    const {username, password} = req.body
    var salt = crypto.randomBytes(16).toString('hex')
    var login_db = new loginModel();
    login_db.username = username;
    login_db.salt = salt;
    login_db.password = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    login_db.save((err, doc)=>{
        if (!err) {
            console.log("New Account Info Succesully Added!");
            res.redirect('/login');
        }
        else {
            console.log(err);
        }
    })
})

//Login Page
router.get('/login', function(req, res) {
    res.render('login', {
        title: 'Login'
    });
});

router.post('/login', urlencodedParser, function(req, res) { 
    const {username, password} = req.body
    loginModel.findOne({ username : username }, function(err, user) { 
        if (user === null) { 
            res.send("User not found!")
        } 
        else { 
            var salt = user['salt']
            if (crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex') === user['password']) {
                console.log("Succesfully Logged In!")
                //Make an authentication cookie
                res.redirect('/items')
            }
            else {
                res.send("Wrong Password!")
            }
        } 
    }); 
}); 

//Make post request for login
//Search database for the username and password 
//If they match make a authentication cookie and send to item listing page
//If not say wrong login information and send 

// Exports
module.exports = router;