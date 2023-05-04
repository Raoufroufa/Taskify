const mongoose = require("mongoose");

// Define the Card schema
const CardSchema = new mongoose.Schema({
  id: String,
  title: String,
});

// Define the Data schema
const DataSchema = new mongoose.Schema({
  lists: {
    type: Map,
    of: new mongoose.Schema({
      id: String,
      title: String,
      cards: [CardSchema],
    }),
  },
  listIds: [String],
});

const Card = mongoose.model("Card", CardSchema);
const Data = mongoose.model("Data", DataSchema);

module.exports = { Card, Data };
