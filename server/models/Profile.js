import mongoose from "mongoose";


const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: 50,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 160,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    appearance: {
      theme: {
        type: String,
        default: "minimal",
      },
      backgroundType: {
        type: String,
        enum: ["color", "gradient"],
        default: "color",
      },
      backgroundColor: {
        type: String,
        default: "#f7f7f5",
      },
      gradientFrom: {
        type: String,
        default: "#f7f7f5",
      },
      gradientTo: {
        type: String,
        default: "#e5e7eb",
      },
      textColor: {
        type: String,
        default: "#171717",
      },
      buttonColor: {
        type: String,
        default: "#ffffff",
      },
      buttonTextColor: {
        type: String,
        default: "#171717",
      },
      buttonStyle: {
        type: String,
        enum: ["fill", "outline", "soft"],
        default: "fill",
      },
      buttonRadius: {
        type: String,
        enum: ["square", "rounded", "pill"],
        default: "rounded",
      },
      font: {
        type: String,
        enum: ["inter", "poppins", "dm-sans", "space-grotesk"],
        default: "inter",
      },
    },
  },
  {
    timestamps: true,
  },
);
const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
