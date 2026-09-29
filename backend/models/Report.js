const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    // Unique EcoGuard report ID
    reportId: {
      type: String,
      unique: true,
      required: true,
    },

    // User who created this report
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    wasteType: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Pending Review",
        "In Progress",
        "Resolved",
      ],
      default: "Pending Review",
    },

    hasImage: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);