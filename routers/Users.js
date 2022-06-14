const express = require("express");
const router = express.Router();
const UserDB = require("../models/Users");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


router.post('/signup', async (req, res) => {
  try {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;

    let doc = await UserDB.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    }) 
    res.status(201).send({
      status: true,
      message: "user created successfully",
      data: doc
    })
  } catch (error) {
    res.status(400).send({
      status: false,
      message: "Error while creating user"
    })
  }
})

router.post('/login', async (req, res) => {
  try {
    //check the email in db
    let user = await UserDB.findOne({ email: req.body.email });
    if (user) {
      //compare the passwords
      let compare = bcrypt.compareSync(req.body.password, user.password);
      if (compare) {
        let token = jwt.sign(
          { name: user.name, email: user.email },
          "anySecretKeyCanBeHere",
          // { expiresIn: '24h' }
        );
        res.status(201).json({ token, user });
      } else {
        res.status(401).json({error:"Password is wrong"});
      }
    } else {
      res.status(404).json({error:"Enter the registered e-mail"});
    }
  } catch (error) {
    res.status(500).json(error);
  }
})

module.exports = router;