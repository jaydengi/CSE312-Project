var mongoose = require('mongoose');

var itemDataSchema = new Schema({
    name: String,
    price: Number,
    description: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});

module.exports = new mongoose.model('itemData', itemDataSchema);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set("view engine", "ejs");