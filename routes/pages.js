var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var path = require("path");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var mongoose = require("mongoose");
var multer = require("multer");
var crypto = require("crypto");
const e = require('express');
require("dotenv/config");


// Item schema
var itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  img: String,
});
itemModel = mongoose.model("item", itemSchema);

//Login Schema
const loginSchema = new mongoose.Schema({
  username: String,
  salt: String,
  password: String,
});
loginModel = mongoose.model("login", loginSchema);

// Auction schema
var auctionSchema = new mongoose.Schema({
  name: String,
  initialbid: Number,
  highestbid: Number,
  description: String,
  img: String,
});
auctionModel = mongoose.model("auction", auctionSchema);

//Cookie Schema
var cookieSchema = new mongoose.Schema({
  hashedToken: String,
  username: String,
  salt: String,
});
cookieModel = mongoose.model("cookie", cookieSchema);

var cartSchema = new mongoose.Schema({
    username: String,
    item_ids: Array
})
cartModel = mongoose.model('cart', cartSchema);

// Multer setup
var upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "/usr/src/app/uploads");
    },
    filename: function (req, file, callback) {
      callback(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
});
;

// Homepage
router.get("/", function (req, res) {
  var cookiePresent = [];
  for (x in req.cookies) {
    cookiePresent.push(x);
  }
  if (cookiePresent.length == 0) {
    //If cookie is not present
    res.render("index", {
      title: "Home",
      username: "",
    });
  } else {
    //If cookie is present
    res.render("index", {
      title: "Home",
      username: req.cookies.username,
    });
  }
});



// Item Listings Page
router.get("/items", function (req, res) {
  var cookiePresent = [];
  for (x in req.cookies) {
    cookiePresent.push(x);
  }
  if (cookiePresent.length == 0) {
    res.send("Register an account and login, to unlock feature!");
  } else {
    itemModel.find().then(function (doc) {
      res.render("items", {
        title: "Item Listings",
        item: doc,
      });
    });
  }
});

// Shopping Cart Page
router.get("/shopping-cart", function (req, res) {

    var client_cookies = req.cookies;

    if(client_cookies.hasOwnProperty('username')){
        cartModel.find({username : client_cookies['username']} , function(err, usercart){
            if(usercart.length == 0){
                console.log("there is no cart for this user");
                res.render('shoppingcart', {
                    title: 'Shopping Cart',
                    item : []
                });
            }else{
                let cart = usercart[0]
                var item_ids_list = new Set(cart['item_ids']);
                var item_list = [];
                itemModel.find().then(function(items){
                    for (let i = 0; i < items.length; i++) {
                        let items_id = items[i]._id.toString();
                        if(item_ids_list.has(items_id)){
                            item_list.push(items[i]);
                        }
                    }
                  res.render("shoppingcart", {
                    title: "Shopping Cart",
                    item: item_list
                    })
              });


                
            }
        })
    
    }
    
});

const ObjectId = require('mongodb').ObjectId;
router.post('/add-cart',function(req,res){
    console.log("PASDOASDs")
    var client_cookies = req.cookies;
    console.log(client_cookies)
    cartModel.find({username : client_cookies['username']} , function(err, usercart){
        console.log(usercart)
        if (usercart.length == 0){
            var id_item = req.body.id;
            console.log("HELLO");
            console.log(id_item);
            var cart = new cartModel();
                    cart.username = client_cookies['username'];
                    cart.item_ids = [id_item];
                    console.log(cart);
                    cart.save((err,doc)=>{
                        if (!err) {
                            //cart added to database with item in cart
                        }
                        else {
                            console.log(err);
                        }
            })
        }
        else{
            var item_list = usercart[0]['item_ids']
            var new_item = req.body.id;
            var in_list = false;

            for(var i = 0; i < item_list.length; i++){
                if(new_item == item_list[i]){
                    in_list = true;
                    break;
                }
            }
            if(in_list == false){
                console.log("KEKW");
                console.log(new_item);
                item_list.push(new_item);
                usercart.item_ids = item_list;
                console.log(usercart);
                usercart.save((err,doc)=>{
                    if (!err) {
                        //cart added to database with item in cart
                    }
                    else {
                        console.log(err);
                    }
                })
            }else{
                console.log("It is already in the cart");
            }

        }
    })
})

// Add Item Page
router.get("/add-item", function (req, res) {
  res.render("additem", {
    title: "Add Item",
  });
});

// Post Item
router.post("/post-item", upload.single("image"), (req, res) => {
  var cookiePresent = [];
  for (x in req.cookies) {
    cookiePresent.push(x);
  }
  if (cookiePresent.length == 0) {
    res.send("You can't log out if you weren't logged in silly!");
  } else {
    var item = new itemModel();
    item.name = req.body.name;
    item.price = req.body.price;
    item.description = req.body.description;
    item.img = req.file.filename;
    console.log("item:", item);
    item.save((err, doc) => {
      if (!err) {
        console.log("Item saved successfully");
        res.redirect("/items");
      } else {
        console.log(err);
      }
    });
  }
});

// Registration Page
router.get("/register", function (req, res) {
  res.render("register", {
    title: "Register",
  });
});

router.post("/register", urlencodedParser, function (req, res) {
  const { username, password } = req.body;
  var salt = crypto.randomBytes(16).toString("hex");
  var login_db = new loginModel();
  login_db.username = username;
  login_db.salt = salt;
  login_db.password = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  login_db.save((err, doc) => {
    if (!err) {
      console.log("New Account Info Succesully Added!");
      res.redirect("/login");
    } else {
      console.log(err);
    }
  });
});

//Logout Button
router.post("/logout", function (req, res) {
  var cookiePresent = [];
  for (x in req.cookies) {
    cookiePresent.push(x);
  }
  if (cookiePresent.length == 0) {
    res.send("You can't log out if you weren't logged in silly!");
  } else {
    console.log("Cookie cleared!");
    res.clearCookie("token");
    res.clearCookie("username");
    res.redirect("/login");
  }
});

//Login Page
router.get("/login", function (req, res) {
  res.render("login", {
    title: "Login",
  });
});

router.post("/login", urlencodedParser, function (req, res) {
  const { username, password } = req.body;
  loginModel.findOne({ username: username }, function (err, user) {
    if (user === null) {
      res.send("User not found!");
    } else {
      var salt = user["salt"];
      if (
        crypto
          .pbkdf2Sync(password, salt, 1000, 64, "sha512")
          .toString("hex") === user["password"]
      ) {
        console.log("Succesfully Logged In!");
        //Make an authentication cookie
        var array = new Uint32Array(10);
        var tokenV1 = "user" + crypto.getRandomValues(array); //Original Token
        var salt = crypto.randomBytes(16).toString("hex"); //Salt
        //Adding info to db
        var cookie_db = new cookieModel();
        cookie_db.username = username;
        cookie_db.salt = salt;
        cookie_db.hashedToken = crypto
          .pbkdf2Sync(tokenV1, salt, 1000, 64, "sha512")
          .toString("hex");
        cookie_db.save((err, doc) => {
          if (!err) {
            console.log("Succesfully Added in Cookie DB!");
          } else {
            console.log(err);
          }
        });
        res.cookie("token", tokenV1, {
          expires: new Date("01 12 2023"),
          httpOnly: true,
          sameSite: "lax",
        });
        res.cookie("username", username, {
          expires: new Date("01 12 2023"),
          httpOnly: true,
          sameSite: "lax",
        });
        res.redirect("/items");
      } else {
        res.send("Wrong Password!");
      }
    }
  });
});

// Auctions Page
router.get("/auctions", function (req, res) {
  var cookiePresent = [];
  for (x in req.cookies) {
    cookiePresent.push(x);
  }
  if (cookiePresent.length == 0) {
    res.send("You can't log out if you weren't logged in silly!");
  } else {
  auctionModel.find().then(function (doc) {
    res.render("auctions", {
      title: "Auctions",
      auction: doc,
    });
  });
}
});

// Add Auction Page
router.get("/add-auction", function (req, res) {
  res.render("addauction", {
    title: "Add Auction",
  });
});

// Post Auction Page
router.post("/post-auction", upload.single("image"), (req, res) => {
  var cookiePresent = [];
  for (x in req.cookies) {
    cookiePresent.push(x);
  }
  if (cookiePresent.length == 0) {
    res.send("You can't log out if you weren't logged in silly!");
  } else {
  var auction = new auctionModel();
  auction.name = req.body.name;
  auction.initialbid = req.body.initialbid;
  auction.highestbid = req.body.initialbid;
  auction.description = req.body.description;
  auction.img = req.file.filename;
  console.log("auction:", auction);
  auction.save((err, doc) => {
    if (!err) {
      console.log("Auction saved successfully");
      res.redirect("/auctions");
    } else {
      console.log(err);
    }
  });
}
});

// Exports
module.exports = router;
