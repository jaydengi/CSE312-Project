// Init Express + Mongoose
var express = require("express");
var ws = require("ws");
var path = require("path");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();
var fs = require("fs");
var cookieParser = require("cookie-parser");
require("dotenv/config");

// Setup websocket
const server = require("http").createServer(app);
const wsServer = new ws.Server({ server });

//bidSchema
var bidSchema = new mongoose.Schema({
  username: String,
  itemid: String,
  amount: Number,
});
bidModel = mongoose.model("bid", bidSchema);

// Connect to db
mongoose.connect("mongodb://mongo_db:27017");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

// EJS setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Cookies setup
app.use(cookieParser());

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set public folder
console.log(path.join(__dirname, "public"));
app.use(express.static(path.join(__dirname, "public")));

// Set uploads folder
console.log(path.join(__dirname, "uploads"));
app.use(express.static(path.join(__dirname, "uploads")));

// Set routes
var pages = require("./routes/pages.js");
app.use("/", pages);
app.use("/add-item", pages);
app.use("/add-auction", pages);

// Websocket event listener
wsServer.on("connection", (socket) => {
  console.log("connect is on");
  socket.on("message", (message) => {
    //log the received message and send it back to the client
    var bid = new bidModel();
    bid.username = ""; //need to get username still
    bid.itemid = ""; //need to get itemid still
    bid.amount = parseInt(message);
    console.log("bid:", bid);

    bid.save((err, doc) => {
      if (!err) {
        console.log("bid saved successfully");
      } else {
        console.log(err);
      }
    });
    console.log("received: %s", message);
    socket.send(`Hello, you sent -> ${message}`);
  });

  //send immediatly a feedback to the incoming connection
  socket.send("websocket server");
});

// Start the server
var port = 3000;
server.listen(port, function () {
  console.log("Server started on port " + port);
});
