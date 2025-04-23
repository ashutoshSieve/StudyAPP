require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.URL_DB)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((error) => console.error("MongoDB connection error:", error));

const SuperSubtaskSchema = new mongoose.Schema({
    id: { type: String },
    title: { type: String, required: true },
    isCompleted: {type: Boolean, default: false},
    comfortLevel: {type: String} 
});

const SubtaskSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String, required: true },
  superSubtask: [SuperSubtaskSchema],
  activityLog: [
    {
      date: { type: String },
      count: { type: Number, default: 0 }
    }
  ]
});

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  id: { type: String },
  title: { type: String, required: true },
  subtasks: [SubtaskSchema]
});

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
