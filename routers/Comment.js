const express = require("express");
const router = express.Router();
const CommentDB = require("../models/Comment");
const authenticate = require("./authenticate")

router.post('/:id', authenticate, async (req, res) => {
  try {
    let doc = await CommentDB.create({
      question_id: req.params.id,
      comment: req.body.comment,
      user:req.body.user
    }) 
    res.status(201).send({
      status: true,
      message: "comment added successfully",
      data: doc
    })
  } catch (error) {
    res.status(400).send({
      status: false,
      message: "Error while adding comment"
    })
  }
})

module.exports = router;