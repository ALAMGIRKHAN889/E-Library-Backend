const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true }, 
    department: { type: String, required: true },
    semester: { type: String, required: true }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
