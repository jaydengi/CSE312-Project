const path = require('path');
const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(express.urlencoded())

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://lyao4321:@cse312user.nfiuxfr.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


app.post("/info", async (req,res) => {
  const account = await client.db("cse312USER").insert(req.body)
  console.log(account)
  return res.json(account)
}); 


app.get("/api", (req, res) => {
    res.json("HELLO");
  });  

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
