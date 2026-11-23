import bcrypt from "bcryptjs"
import User from "../models/User.js"
import Profile from "../models/Profile.js"
import Block from "../models/Block.js"
import PageView from "../models/PageView.js"
import LinkClick from "../models/LinkClick.js"

export async function updateAccount(req, res) {
  try {
    const { name, email, username } = req.body

    const cleanEmail = email?.trim().toLowerCase()
    const cleanUsername = username?.trim().toLowerCase()

    if (!name || !cleanEmail || !cleanUsername) {
      return res.status(400).json({
        success: false,
        message: "Name, email and username are required",
      })
    }

    if (!/^[a-z0-9._]+$/.test(cleanUsername)) {
      return res.status(400).json({
        success: false,
        message:
          "Username can only contain letters, numbers, dots and underscores",
      })
    }

    const duplicate = await User.findOne({
      _id: { $ne: req.user._id },
      $or: [
        { email: cleanEmail },
        { username: cleanUsername },
      ],
    })

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message:
          duplicate.email === cleanEmail
            ? "That email is already in use"
            : "That username is already taken",
      })
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name.trim(),
        email: cleanEmail,
        username: cleanUsername,
      },
      {
        new: true,
        runValidators: true,
      }
    )

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Could not update account",
    })
  }
}

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both password fields are required",
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      })
    }

    const user = await User.findById(req.user._id).select("+password")

    const matches = await bcrypt.compare(
      currentPassword,
      user.password
    )

    if (!matches) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      })
    }

    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: "Password updated",
    })
  } catch {
    res.status(500).json({
      success: false,
      message: "Could not update password",
    })
  }
}

export async function deleteAccount(req, res) {
  try {
    const userId = req.user._id

    await Promise.all([
      Profile.deleteOne({ user: userId }),
      Block.deleteMany({ user: userId }),
      PageView.deleteMany({ user: userId }),
      LinkClick.deleteMany({ user: userId }),
    ])

    await User.findByIdAndDelete(userId)

    res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      })
      .json({
        success: true,
        message: "Account deleted",
      })
  } catch {
    res.status(500).json({
      success: false,
      message: "Could not delete account",
    })
  }
}
