const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./Routes/userRoute.js")

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'https://e-library-frontend-cyan.vercel.app/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

  
app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
