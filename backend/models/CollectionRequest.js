const mongoose = require("mongoose");

const collectionRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      unique: true,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    wasteType: {
      type: String,
      required: true,
    },

    quantity: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    preferredDate: {
      type: String,
      required: true,
    },

    preferredTime: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Collected",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CollectionRequest",
  collectionRequestSchema
);