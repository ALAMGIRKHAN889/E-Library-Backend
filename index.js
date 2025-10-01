const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const serverless = require("serverless-http");

const userRoutes = require("./Routes/userRoute.js");
const departmentRoutes = require("./Routes/DepartmentRoute.js");
const courseRoutes = require("./Routes/courseRoute.js");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://e-library-frontend-cyan.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/courses", courseRoutes);


module.exports = app;
module.exports.handler = serverless(app);
