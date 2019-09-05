const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://pdarchibald:mlarchibald@cluster0-vdsoz.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "FYI";
const ObjectId = require("mongodb").ObjectId;

app.use(express.json());
app.use(cors());

app.get("/leads", (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, { useUnifiedTopology: true }, function(err, client) {
    if(!err) {
    const db = client.db(dbName);
    const collection = db.collection('users');
    collection.find({status: 'potentialClient'}).toArray((err, docs) => {
      client.close();
      res.send(docs);
    });
  } else {
    console.log(err);
  }
  });
});

app.get("/clients", (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, { useUnifiedTopology: true }, function(err, client) {
    const db = client.db(dbName);
    const collection = db.collection('users');
    collection.find({status: 'currentClient'}).toArray((err, docs) => {
      client.close();
      res.send(docs);
    });
  });
});

app.post("/leads", (req, res) => {

    MongoClient.connect(url, { useNewUrlParser: true }, { useUnifiedTopology: true }, (err, client) => {
        const db = client.db(dbName);
        const collection = db.collection("users");
        collection.insertMany([
          {
            name: req.body.name,
            email: req.body.email,
            date: req.body.date,
            phone: req.body.phone,
            comments: req.body.comments,
            status: req.body.status
          }
        ]);
        client.close();
        res.send("Added user");
      });
});

app.put('/leads/:ID', (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, { useUnifiedTopology: true }, (err, client) => {
    const db = client.db(dbName);
    const collection = db.collection("users");
    collection.updateOne({_id: ObjectId(req.params.ID)}, {$set: req.body});
    client.close();
    res.send("Updated");
  });
});

app.delete("/leads/:ID", (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, { useUnifiedTopology: true }, async (err, client) => {
    const db = client.db(dbName);
    const collection = db.collection("users");
    await collection.deleteOne({_id: ObjectId(req.params.ID)});
    res.send("Deleted");

    client.close();
  });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
