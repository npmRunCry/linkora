import mongoose from "mongoose"

const pageViewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

pageViewSchema.index({ user: 1, createdAt: -1 })

const PageView = mongoose.model("PageView", pageViewSchema)

export default PageView
