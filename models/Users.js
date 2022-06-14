const mongoose = require("mongoose");
const usersSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  created_at: {
    type: Date,
    default: Date.now()
  },
})

module.exports = mongoose.model("users", usersSchema);