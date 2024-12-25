import mongoose from "mongoose";

export const reviewStatus = {
  offline: "offline",
  reviewed: "reviewed",
  deleted: "deleted",
};
const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
    email: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    score: { type: Number, require: true },
    content: { type: String, maxLength: 255 },
    status: {
      type: String,
      enum: reviewStatus,
      default: reviewStatus.offline,
    },
    created: { type: Date, default: new Date() },
    active: {
      type: Boolean,
      default: true,
      private: true,
    },
  },
  {
    collection: "Reviews",
    timestamps: true,
    versionKey: false,
  }
);

const Review = mongoose.model("Reviews", reviewSchema);

export default Review;
