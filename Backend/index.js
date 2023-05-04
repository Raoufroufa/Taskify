// jshint esversion:6

const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const cors = require("cors");

// const apiRouter = require("./routes/api");

dotenv.config();
const app = express();

app.use(cors());
app.set("view engine", "ejs");
mongoose.set("strictQuery", true);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// // connect to mongodb
mongoose.connect(
  "mongodb+srv://raouf:123456Raouf@cluster0.zwk8poe.mongodb.net/?retryWrites=true&w=majority"
);

mongoose.connection
  .once("open", function () {
    console.log("Connection has been made, now make fireworks...");
  })
  .on("error", function (error) {
    console.log("Connection error:", error);
  });


 
  const { Card, Data } = require("./models/const");

  // Route to get all cards from MongoDB
  app.get("/cards", async (req, res) => {
    try {
      const cards = await Card.find({});
      res.json(cards);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  // Route to get data from MongoDB
  app.get("/data", async (req, res) => {
    try {
      const data = await Data.findOne({});
      res.json(data);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  // Route to post card to MongoDB
app.post("/cards", async (req, res) => {
  let newcard = new Card({
    id: req.body.id,
    title: req.body.title,
  });
    try {
      const card = await newcard.save();
      res.json(card);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  // Route to post data to MongoDB
  app.post("/data", async (req, res) => {
  let newdata = new Data({
    lists: req.body.lists,
    listIds: req.body.listIds,
  });
    try {
      const data = await newdata.save();
      res.json(data);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

// initiallize routes
// app.use("/api", apiRouter);

app.listen(5000, () => console.log("Server started on port 5000"));

