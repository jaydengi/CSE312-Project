var express = require('express');
var router = express.Router();

// Homepage
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Home'
    });
});

// Login Page
router.get('/login', function(req, res) {
    res.render('login', {
        title: 'Login'
    });
});

// Item Listings Page
router.get('/items', function(req, res) {
    res.render('items', {
        title: 'Item Listings'
    });
});

// Item Listings Page
router.get('/items', function(req, res) {
    res.render('items', {
        title: 'Item Listings'
    });
});

// Item Listings Page
router.get('/shopping-cart', function(req, res) {
    res.render('shoppingcart', {
        title: 'Shopping Cart'
    });
});


// Exports
module.exports = router;