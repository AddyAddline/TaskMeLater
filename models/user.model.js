const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { UserPriority } = require("../utils/enums");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number,
      unique: true, 
    },
    phone_number: {
      type: String,
      required: true,
    },
    priority: {
      type: Number,
      enum: [
        UserPriority.HIGH_PRIORITY,
        UserPriority.MID_PRIORITY,
        UserPriority.LOW_PRIORITY,
      ],
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
userSchema.plugin(AutoIncrement, { inc_field: "user_id" });

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {
         
          _id: this._id,
        user_id: this.user_id,
        phone_number: this.phone_number,

        },
        process.env.JWT_SECRET,
        {
        expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );
    return token;
    }
const User= mongoose.model("User", userSchema);
module.exports = User;
