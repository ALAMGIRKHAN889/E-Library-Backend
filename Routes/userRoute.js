const express = require("express");
const User = require("../Models/User.js");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find({ role: "student" });
    console.log(users);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const { name, password, department, semester , role } = req.body;

    if (!name || !password || !department || !semester || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, password: hashedPassword, department: department.toLowerCase(), semester , role });
    await user.save();

    res.status(201).json({ message: "Student saved successfully", user });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: "Name and password are required" });
    }

    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({ message: "Login successful", user: userWithoutPassword });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:name", async (req, res) => {
  try {
    const userName = req.params.name;
    const user = await User.findOne({ name: { $regex: userName, $options: 'i' } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:name", async (req, res) => {
  try {
    const userName = req.params.name;
    const { password, department, semester, role } = req.body;

    const user = await User.findOne({ name: { $regex: userName, $options: 'i' } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateFields = {};
    if (department !== undefined) updateFields.department = department.toLowerCase();
    if (semester !== undefined) updateFields.semester = semester;
    if (role !== undefined) updateFields.role = role;
    if (password !== undefined && password !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await User.findOneAndUpdate(
      { name: { $regex: userName, $options: 'i' } },
      updateFields,
      { new: true }
    );

    res.status(200).json({ message: "Student updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
