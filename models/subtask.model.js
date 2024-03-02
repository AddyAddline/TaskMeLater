const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { SubTaskStatus } = require("../utils/enums");


const subtaskSchema = new mongoose.Schema(
  {
    subtask_id: {
      type: Number,
        unique: true,
    },
    task_id: {
      type: Number,
      ref: "Task",
    },
    status: {
      type: Number,
      enum: [SubTaskStatus.INCOMPLETE, SubTaskStatus.COMPLETE],
      required: true,
      default: SubTaskStatus.INCOMPLETE,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    deleted_at: {
      type: Date,
    },
  },

  {
    // will automatically give a timestamp of created_at and updated_at
    timestamps: {
      created_at: "created_at",
      updated_at: "updated_at",
    },
  }
);

subtaskSchema.plugin(AutoIncrement, { inc_field: "subtask_id" });

const SubTask = mongoose.model("SubTask", subtaskSchema);
module.exports = SubTask;

