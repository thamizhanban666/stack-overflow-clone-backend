const mongoose = require("mongoose");
const answerSchema = new mongoose.Schema({
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "questions"
  },
  answer: String,
  created_at: {
    type: Date,
    default: Date.now()
  },
  user: Object,
})

module.exports = mongoose.model("answers",answerSchema)