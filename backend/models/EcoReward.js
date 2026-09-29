const mongoose = require("mongoose");

const ecoRewardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    points: {
      type: Number,
      default: 0,
    },

    reportsCompleted: {
      type: Number,
      default: 0,
    },

    collectionsCompleted: {
      type: Number,
      default: 0,
    },

    aiDetections: {
      type: Number,
      default: 0,
    },

    level: {
      type: String,
      enum: [
        "Eco Beginner",
        "Green Citizen",
        "Eco Champion",
        "Eco Guardian",
      ],
      default: "Eco Beginner",
    },

    badges: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "EcoReward",
  ecoRewardSchema
);