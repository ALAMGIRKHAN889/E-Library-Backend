const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    departmentName: { type: String, required: true },
    semesterNo: { type: Number, required: true },
    courseName: { type: String, required: true },
    pdf_url: { type: String, required: true },
    instructor: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
