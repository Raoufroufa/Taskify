const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create list Schema & model
const ListSchema = new Schema({
  name: {
    type: String,
    required: true,
  }
});

const List = mongoose.model("list", ListSchema);

module.exports = List;
