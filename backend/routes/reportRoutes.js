const express = require("express");
const Report = require("../models/Report");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// CREATE REPORT
// =====================================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      wasteType,
      location,
      severity,
      description,
      hasImage,
    } = req.body;

    // Validate required fields
    if (
      !wasteType ||
      !location ||
      !severity ||
      !description
    ) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    // Generate unique report ID
    const reportId =
      "EG-" +
      Math.floor(
        100000 + Math.random() * 900000
      );

    // Create report
    const report = new Report({
      reportId,

      // Get logged-in user's ID from JWT
      userId: req.user.id,

      wasteType,
      location,
      severity,
      description,
      hasImage: hasImage || false,
    });

    const savedReport = await report.save();

    res.status(201).json({
      message: "Waste report submitted successfully!",
      report: savedReport,
    });
  } catch (error) {
    console.error("Create report error:", error);

    res.status(500).json({
      message: "Failed to submit report.",
      error: error.message,
    });
  }
});

// =====================================================
// GET MY REPORTS
// =====================================================
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json(reports);
  } catch (error) {
    console.error("Fetch my reports error:", error);

    res.status(500).json({
      message: "Failed to fetch your reports.",
      error: error.message,
    });
  }
});

// =====================================================
// GET ALL REPORTS
// ADMIN
// =====================================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Only admin can access all reports
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required.",
      });
    }

    const reports = await Report.find()
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.error("Fetch all reports error:", error);

    res.status(500).json({
      message: "Failed to fetch reports.",
      error: error.message,
    });
  }
});

// =====================================================
// UPDATE REPORT STATUS
// ADMIN
// =====================================================
router.patch(
  "/:id/status",
  authMiddleware,
  async (req, res) => {
    try {
      // Only admin can update status
      if (req.user.role !== "admin") {
        return res.status(403).json({
          message: "Admin access required.",
        });
      }

      const { id } = req.params;
      const { status } = req.body;

      const allowedStatuses = [
        "Pending Review",
        "In Progress",
        "Resolved",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid report status.",
        });
      }

      const updatedReport =
        await Report.findByIdAndUpdate(
          id,
          { status: status },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!updatedReport) {
        return res.status(404).json({
          message: "Report not found.",
        });
      }

      res.json({
        message:
          "Report status updated successfully!",
        report: updatedReport,
      });
    } catch (error) {
      console.error(
        "Update report status error:",
        error
      );

      res.status(500).json({
        message: "Failed to update report status.",
        error: error.message,
      });
    }
  }
);

module.exports = router;