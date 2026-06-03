import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
    },
    userAgent: {
      type: String,
      default: "Unknown",
    },
    ipAddress: {
      type: String,
      default: "Unknown",
    },
    referrer: {
      type: String,
      default: "Unknown",
    },
  },
  {
    timestamps: true,
  }
);

const Visit = mongoose.model("Visit", visitSchema);

export default Visit;