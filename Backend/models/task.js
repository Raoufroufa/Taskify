const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// creat task Schema & model
const TaskSchema = new Schema({
  title: {
    type: String,
    required: true,
	},
  id_list: {
	  type: Schema.Types.ObjectId,
      ref: "list",
  }, 	
  
});

const Task = mongoose.model("task", TaskSchema);

module.exports = Task;
