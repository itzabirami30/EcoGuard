const express = require("express");
const router = express.Router();

const SanitationRequest = require("../models/SanitationRequest");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// CREATE SANITIZATION REQUEST - CITIZEN
// ==========================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      areaType,
      location,
      issue,
      description,
      priority,
    } = req.body;

    // Validate required fields
    if (!areaType || !location || !issue) {
      return res.status(400).json({
        success: false,
        message: "Area type, location and issue are required.",
      });
    }

    // Generate request ID
    const requestId =
      "SR-" + Math.floor(100000 + Math.random() * 900000);

    const request = new SanitationRequest({
      requestId,
      userId: req.user.id,
      areaType,
      location,
      issue,
      description: description || "",
      priority: priority || "Medium",
    });

    await request.save();

    res.status(201).json({
      success: true,
      message: "Sanitization request submitted successfully!",
      request,
    });
  } catch (error) {
    console.error("Create sanitation request error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to submit sanitization request.",
    });
  }
});

// ==========================================
// GET MY SANITIZATION REQUESTS - CITIZEN
// ==========================================
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const requests = await SanitationRequest.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Get my sanitation requests error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load sanitization requests.",
    });
  }
});

// ==========================================
// GET ALL SANITIZATION REQUESTS - ADMIN
// ==========================================
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    // Check admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    const requests = await SanitationRequest.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Get admin sanitation requests error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load sanitation requests.",
    });
  }
});

// ==========================================
// UPDATE STATUS - ADMIN
// ==========================================
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    // Check admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    const { status } = req.body;

    const allowedStatuses = [
      "Reported",
      "Assigned",
      "Cleaning in Progress",
      "Resolved",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sanitation status.",
      });
    }

    const request = await SanitationRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Sanitation request not found.",
      });
    }

    res.json({
      success: true,
      message: "Sanitation status updated successfully.",
      request,
    });
  } catch (error) {
    console.error("Update sanitation status error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update sanitation status.",
    });
  }
});

module.exports = router;