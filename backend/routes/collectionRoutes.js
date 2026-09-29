const express = require("express");
const CollectionRequest = require("../models/CollectionRequest");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// CREATE COLLECTION REQUEST - CITIZEN
// ========================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      wasteType,
      quantity,
      location,
      preferredDate,
      preferredTime,
      description,
    } = req.body;

    if (
      !wasteType ||
      !quantity ||
      !location ||
      !preferredDate ||
      !preferredTime
    ) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const requestId =
      "CR-" +
      Math.floor(100000 + Math.random() * 900000);

    const collectionRequest = new CollectionRequest({
      requestId,
      userId: req.user.id,
      wasteType,
      quantity,
      location,
      preferredDate,
      preferredTime,
      description: description || "",
    });

    const savedRequest = await collectionRequest.save();

    res.status(201).json({
      message: "Collection request submitted successfully!",
      request: savedRequest,
    });
  } catch (error) {
    console.error("Create collection request error:", error);

    res.status(500).json({
      message: "Failed to submit collection request.",
      error: error.message,
    });
  }
});

// ========================================
// GET MY COLLECTION REQUESTS - CITIZEN
// ========================================
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const requests = await CollectionRequest.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json(requests);
  } catch (error) {
    console.error("Fetch collection requests error:", error);

    res.status(500).json({
      message: "Failed to fetch collection requests.",
      error: error.message,
    });
  }
});

// ========================================
// GET ALL COLLECTION REQUESTS - ADMIN
// ========================================
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required.",
      });
    }

    const requests = await CollectionRequest.find()
      .populate("userId", "name email")
      .sort({
        createdAt: -1,
      });

    res.json(requests);
  } catch (error) {
    console.error("Fetch admin collection requests error:", error);

    res.status(500).json({
      message: "Failed to fetch collection requests.",
      error: error.message,
    });
  }
});

// ========================================
// UPDATE COLLECTION STATUS - ADMIN
// ========================================
router.patch(
  "/:id/status",
  authMiddleware,
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          message: "Admin access required.",
        });
      }

      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "Accepted",
        "Collected",
        "Cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid collection status.",
        });
      }

      const updatedRequest =
        await CollectionRequest.findByIdAndUpdate(
          req.params.id,
          { status },
          {
            new: true,
            runValidators: true,
          }
        ).populate("userId", "name email");

      if (!updatedRequest) {
        return res.status(404).json({
          message: "Collection request not found.",
        });
      }

      res.json({
        message: "Collection status updated successfully!",
        request: updatedRequest,
      });
    } catch (error) {
      console.error(
        "Update collection status error:",
        error
      );

      res.status(500).json({
        message: "Failed to update collection status.",
        error: error.message,
      });
    }
  }
);

module.exports = router;