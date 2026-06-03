import mongoose from "mongoose";
const visitSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Visit = mongoose.model(
  "Visit",
  visitSchema
);

export default Visit;