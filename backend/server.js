const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const reportRoutes = require("./routes/reportRoutes");
const detectionRoutes = require("./routes/detectionRoutes");
const app = express();
const authRoutes = require("./routes/authRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/reports", reportRoutes);
app.use("/api/detection", detectionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/collection", collectionRoutes);
// Test route
app.get("/", (req, res) => {
  res.json({
    message: "EcoGuard Backend is running successfully!"
  });
});

// Port
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`EcoGuard server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed!");
    console.error(error.message);
  });