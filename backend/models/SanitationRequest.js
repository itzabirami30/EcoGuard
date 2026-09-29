const mongoose = require("mongoose");

const sanitationRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    areaType: {
      type: String,
      required: true,
      enum: [
        "Public Toilet",
        "Street",
        "Drainage Area",
        "Community Area",
        "Collection Point",
        "Other",
      ],
    },

    location: {
      type: String,
      required: true,
    },

    issue: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: [
        "Reported",
        "Assigned",
        "Cleaning in Progress",
        "Resolved",
      ],
      default: "Reported",
    },

    assignedTo: {
      type: String,
      default: "",
    },

    beforeImage: {
      type: String,
      default: "",
    },

    afterImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SanitationRequest",
  sanitationRequestSchema
);