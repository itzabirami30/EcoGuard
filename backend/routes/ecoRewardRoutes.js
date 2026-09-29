const express = require("express");
const router = express.Router();

const EcoReward = require("../models/EcoReward");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// GET MY ECO REWARDS
// ==========================================

router.get("/my", authMiddleware, async (req, res) => {
  try {
    let reward = await EcoReward.findOne({
      userId: req.user.id,
    });

    // Create reward profile if it doesn't exist
    if (!reward) {
      reward = await EcoReward.create({
        userId: req.user.id,
      });
    }

    res.json({
      success: true,
      reward,
    });
  } catch (error) {
    console.error("Get rewards error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load Eco Rewards.",
    });
  }
});

// ==========================================
// ADD ECO POINTS
// ==========================================

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { action } = req.body;

    let reward = await EcoReward.findOne({
      userId: req.user.id,
    });

    if (!reward) {
      reward = await EcoReward.create({
        userId: req.user.id,
      });
    }

    let pointsToAdd = 0;

    // --------------------------------------
    // POINT SYSTEM
    // --------------------------------------

    if (action === "report") {
      pointsToAdd = 20;
      reward.reportsCompleted += 1;
    }

    else if (action === "ai_detection") {
      pointsToAdd = 10;
      reward.aiDetections += 1;
    }

    else if (action === "collection") {
      pointsToAdd = 30;
      reward.collectionsCompleted += 1;
    }

    else {
      return res.status(400).json({
        success: false,
        message: "Invalid reward action.",
      });
    }

    // Add points
    reward.points += pointsToAdd;

    // --------------------------------------
    // UPDATE LEVEL
    // --------------------------------------

    if (reward.points >= 1000) {
      reward.level = "Eco Guardian";
    }

    else if (reward.points >= 500) {
      reward.level = "Eco Champion";
    }

    else if (reward.points >= 200) {
      reward.level = "Green Citizen";
    }

    else {
      reward.level = "Eco Beginner";
    }

    // --------------------------------------
    // BADGES
    // --------------------------------------

    if (
      reward.reportsCompleted >= 1 &&
      !reward.badges.includes("Waste Reporter")
    ) {
      reward.badges.push("Waste Reporter");
    }

    if (
      reward.aiDetections >= 5 &&
      !reward.badges.includes("AI Explorer")
    ) {
      reward.badges.push("AI Explorer");
    }

    if (
      reward.collectionsCompleted >= 3 &&
      !reward.badges.includes("Responsible Citizen")
    ) {
      reward.badges.push("Responsible Citizen");
    }

    if (
      reward.points >= 500 &&
      !reward.badges.includes("Eco Champion")
    ) {
      reward.badges.push("Eco Champion");
    }

    await reward.save();

    res.json({
      success: true,
      message: `${pointsToAdd} Eco Points added!`,
      reward,
    });
  } catch (error) {
    console.error("Add rewards error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to add Eco Points.",
    });
  }
});

module.exports = router;