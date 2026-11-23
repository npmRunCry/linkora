import cloudinary from "../config/cloudinary.js"
import Profile from "../models/Profile.js"

function bufferToDataUri(file) {
  const base64 = file.buffer.toString("base64")
  return `data:${file.mimetype};base64,${base64}`
}

export async function uploadAvatar(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please choose an image",
      })
    }

    const result = await cloudinary.uploader.upload(
      bufferToDataUri(req.file),
      {
        folder: "linkora/avatars",
        transformation: [
          {
            width: 500,
            height: 500,
            crop: "fill",
            gravity: "face",
          },
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      }
    )

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { avatar: result.secure_url },
      { new: true }
    )

    res.status(200).json({
      success: true,
      profile,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not upload image",
    })
  }
}
