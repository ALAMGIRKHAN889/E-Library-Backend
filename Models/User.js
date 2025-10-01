const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true }, 
    department: { type: String, required: true },
    semester: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "student"],
      default: "student" 
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
