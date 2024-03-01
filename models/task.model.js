const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { TaskPriority, TaskStatus } = require("../utils/enums");

const taskSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE],
      required: true,
      default: TaskStatus.TODO,
    },
    priority: {
      type: Number,
      enum: [
        TaskPriority.PRIORITY_0,
        TaskPriority.PRIORITY_1,
        TaskPriority.PRIORITY_2,
        TaskPriority.PRIORITY_3,
      ],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    due_date: {
      type: Date,
      required: true,
    },
    deleted_at: {
      type: Date,
    },
    created_by: {
      type: Number,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at", 
      updatedAt: "updated_at", 
    },
  }
);

// Auto-increment ID using mongoose-sequence
taskSchema.plugin(AutoIncrement, { inc_field: "id" });

const Task = mongoose.model("Task", taskSchema); 

module.exports = Task;
