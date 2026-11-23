import mongoose from "mongoose";
const socialSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);
const blockSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["link", "heading", "socials", "youtube"],
      required: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    url: {
      type: String,
      trim: true,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    socials: {
      type: [socialSchema],
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
    },
    position: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);
blockSchema.index({ user: 1, position: 1 });
const Block = mongoose.model("Block", blockSchema);
export default Block;
