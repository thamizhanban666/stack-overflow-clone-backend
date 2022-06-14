const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const AnswerDB = require("../models/Answer");
const authenticate = require("./authenticate")

router.post('/', authenticate, async (req, res) => {
  
  try {
    const answerData = new AnswerDB({
      question_id: req.body.question_id,
      answer: req.body.answer,
      user: req.body.user
    })
    const doc = await answerData.save();
    res.status(201).send({
      status: true,
      data: doc
    })
  } catch (error) {
    res.status(400).send({
      status: false,
      message: "Answer could not be added"
    })
  }
})

module.exports = router;