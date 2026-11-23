import mongoose from "mongoose"

const linkClickSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Block",
      required: true,
      index: true,
    },
    visitorId: {
      type: String,
      required: true,
      index: true,
    },
    device: {
      type: String,
      default: "Unknown",
    },
    browser: {
      type: String,
      default: "Unknown",
    },
    referrer: {
      type: String,
      default: "Direct",
    },
    country: {
      type: String,
      default: "Unknown",
    },
  },
  {
    timestamps: true,
  }
)

linkClickSchema.index({ user: 1, createdAt: -1 })

const LinkClick = mongoose.model("LinkClick", linkClickSchema)

export default LinkClick
