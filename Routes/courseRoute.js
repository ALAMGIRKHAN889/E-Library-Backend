const express = require("express");
const Course = require("../Models/Course");
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { departmentName, semesterNo, courseName, pdf_url, instructor } = req.body;

    const existingCourse = await Course.findOne({
      courseName: { $regex: new RegExp(`^${courseName}$`, "i") }, 
    });

    if (existingCourse) {
      return res.status(400).json({ message: "Course with the same name already exists." });
    }

    const course = new Course({
      departmentName: departmentName.toLowerCase(),
      semesterNo,
      courseName,
      pdf_url,
      instructor,
    });

    await course.save();
    res.status(201).json({ message: "Course added successfully", course });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.put("/:courseName", async (req, res) => {
  try {
    let { departmentName, semesterNo, courseName, pdf_url, instructor } = req.body;
    semesterNo = Number(semesterNo);

    // prevent duplicates
    const existingCourse = await Course.findOne({
      departmentName,
      semesterNo,
      courseName: { $regex: new RegExp(`^${courseName}$`, "i") },
      courseName: { $ne: req.params.courseName }
    });

    if (existingCourse) {
      return res.status(400).json({
        message: "A course with this name already exists in this department & semester",
      });
    }

    // 👇 Find course ignoring case + spaces
    const updatedCourse = await Course.findOneAndUpdate(
      { courseName: { $regex: new RegExp(`^${req.params.courseName.trim()}$`, "i") } },
      { departmentName, semesterNo, courseName, pdf_url, instructor },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course updated successfully", updatedCourse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;
