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

// Shopping Cart Page
router.get('/shopping-cart', function(req, res) {
    res.render('shoppingcart', {
        title: 'Shopping Cart'
    });
});

// Registration Page
router.get('/register', function(req, res) {
    res.render('register', {
        title: 'Register'
    });
});

router.post('/register', function(req, res) {
    console.log("TESTING!!!!")
    res.send('TESTING!!!!');
})

// Exports
module.exports = router;