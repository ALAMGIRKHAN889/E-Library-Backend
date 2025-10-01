const express = require("express");
const router = express.Router();
const Department = require("../Models/Depart");


router.get("/", async (req, res) => {
  try {
    const { name } = req.query;

    let query = {};
    if (name) {
      query.departmentName = { $regex: new RegExp(name, "i") };
    }

    const departments = await Department.find(query);
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const { departmentName, hod } = req.body;

    if (!departmentName || !hod) {
      return res.status(400).json({ message: "Department name and HOD are required" });
    }

    const existingDept = await Department.findOne({
      departmentName: { $regex: new RegExp(`^${departmentName}$`, "i") },
    });

    if (existingDept) {
      return res.status(400).json({ message: "Department with this name already exists" });
    }

    const department = new Department({
      departmentName: departmentName.toLowerCase(),
      hod,
    });

    await department.save();
    res.status(201).json({ message: "Department added successfully", department });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.put("/:id", async (req, res) => {
  try {
    const { departmentName, hod } = req.body;

    const existingDept = await Department.findOne({
      _id: { $ne: req.params.id },
      departmentName: { $regex: new RegExp(`^${departmentName}$`, "i") },
    });

    if (existingDept) {
      return res.status(400).json({ message: "Another department with this name already exists" });
    }

    const updatedDept = await Department.findByIdAndUpdate(
      req.params.id,
      { departmentName: departmentName.toLowerCase(), hod },
      { new: true }
    );

    if (!updatedDept) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({ message: "Department updated successfully", updatedDept });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




router.delete("/:id", async (req, res) => {
  try {
    const deletedDept = await Department.findByIdAndDelete(req.params.id);
    if (!deletedDept) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
