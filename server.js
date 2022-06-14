const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const router = require('./routers/index');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
const URL = "mongodb+srv://Thamizhanban:Thamizh123@cluster0.yiog4.mongodb.net/stackOverFlow?retryWrites=true&w=majority";

mongoose.connect(URL).then((res) => console.log("mongoDB is connected")).catch((err) => console.log(err))

// Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());

// cors
app.use(cors());

// api
app.use('/api', router);

// listen 
app.listen(PORT, () => {
  console.log(`Web server is running at port-${PORT}`)
})