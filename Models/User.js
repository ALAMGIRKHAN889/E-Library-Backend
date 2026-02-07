const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true }, 
    department: { type: String },
    semester: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
