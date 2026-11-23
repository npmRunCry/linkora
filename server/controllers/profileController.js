import Profile from "../models/Profile.js";
import User from "../models/User.js";
import Block from "../models/Block.js";
import PageView from "../models/PageView.js";
import { getRequestAnalytics } from "../utils/analytics.js";

export async function getMyProfile(req, res) {
  try {
    let profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      profile = await Profile.create({
        user: req.user._id,
        displayName: req.user.name,
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    res.stauts(500).json({
      success: false,
      message: error.message || "Could not load the profile",
    });
  }
}

export async function updateMyProfile(req, res) {
  try {
    const { displayName, bio } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        displayName: displayName?.trim(),
        bio: bio?.trim(),
      },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Could not update profile",
    });
  }
}

export async function updateAppearance(req, res) {
  try {
    const allowedFields = [
      "theme",
      "backgroundType",
      "backgroundColor",
      "gradientFrom",
      "gradientTo",
      "textColor",
      "buttonColor",
      "buttonTextColor",
      "buttonStyle",
      "buttonRadius",
      "font",
    ];

    const update = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        update[`appearance.${field}`] = req.body[field];
      }
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: update },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "could not update appearance",
    });
  }
}

export async function getPublicProfile(req, res) {
  try {
    const user = await User.findOne({
      username: req.params.username.toLowerCase(),
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }
    const [profile, blocks] = await Promise.all([
      Profile.findOne({ user: user._id }),
      Block.find({
        user: user._id,
        active: true,
      })
        .sort({ position: 1 })
        .select("-user"),
    ]);

    const analytics = getRequestAnalytics(req, res)
    
    await PageView.create({
      user: user._id,
      ...analytics,
    })

    res.status(200).json({
      success: true,
      creator: {
        id: user._id,
        username: user.username,
        displayName: profile?.displayName || user.name,
        bio: profile?.bio || "",
        avatar: profile?.avatar || "",
        appearance: profile?.appearance,
      },
      blocks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not load public profile",
    });
  }
}
