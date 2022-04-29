const express = require("express");
const app = express();

const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const URL = "mongodb+srv://Thamizhanban:Thamizh123@cluster0.yiog4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const cors = require("cors");

app.use(cors());
app.use(express.json());

// test
app.get("/test", (req, res) => {
  res.send("Heroku Working");
});

function authenticate(req, res, next) {
  if (req.headers.authorization) {
    let decode = jwt.verify(req.headers.authorization, "anySecretKeyCanBeHere");
    if (decode) {
      next();
    } else {
      res.status(401).json({ error: "Authentication error" });
    }
  } else {
    res.status(401).json({ error:"Authentication error" });
  }
}

app.get("/users", authenticate, async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);
    let db = connection.db("stackOverFlow");
    let getData = await db.collection("users").find().toArray();
    res.json(getData);
    await connection.close();
  } catch (error) {
    res.status(500).json(error);
  }
});

//Signup
app.post("/signup", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);
    let db = connection.db("stackOverFlow");
    //create hash with help of encrypt js
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;

    await db.collection("users").insertOne(req.body);
    res.json("New User Signed Up");
    await connection.close();
  } catch (error) {
    res.status(500).json(error);
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);
    let db = connection.db("stackOverFlow");
    //check the email in db
    let user = await db
      .collection("users")
      .findOne({ email: req.body.email });
    if (user) {
      //compare the passwords
      let compare = bcrypt.compareSync(req.body.password, user.password);
      if (compare) {
        let token = jwt.sign(
          { name: user.username, email: user.email },
          "anySecretKeyCanBeHere"
        );
        res.json({ token });
      } else {
        res.status(500).json({error:"Password is wrong"});
      }
    } else {
      res.status(401).json({error:"Enter the registered e-mail"});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Web server started ");
});