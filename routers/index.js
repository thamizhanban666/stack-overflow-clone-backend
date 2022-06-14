const express = require("express");
const router = express.Router();
const questionRouter = require('./Question.js');
const answerRouter = require('./Answer.js');
const commentRouter = require('./Comment.js');
const usersRouter = require('./Users.js');

router.get('/', (req, res) => {
  res.send("Stack Overflow server is running");
})

router.use('/question', questionRouter);
router.use('/answer', answerRouter);
router.use('/comment', commentRouter);
router.use('/user', usersRouter);

module.exports = router;