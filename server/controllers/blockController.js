import Block from "../models/Block.js";
export async function getBlocks(req, res) {
  try {
    const blocks = await Block.find({ user: req.user._id }).sort({
      position: 1,
    });
    res.status(200).json({
      success: true,
      blocks,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Could not load blocks",
    });
  }
}
export async function createBlock(req, res) {
  try {
    const { type } = req.body;
    if (!["link", "heading", "socials", "youtube"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid block type",
      });
    }
    const count = await Block.countDocuments({ user: req.user._id });
    const defaults = {
      link: { title: "New link", url: "https://" },
      heading: { title: "New heading" },
      socials: { title: "Socials", socials: [] },
      youtube: { title: "YouTube", url: "" },
    };
    const block = await Block.create({
      user: req.user._id,
      type,
      position: count,
      ...defaults[type],
    });
    res.status(201).json({
      success: true,
      block,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Could not create block",
    });
  }
}
export async function updateBlock(req, res) {
  try {
    const allowedFields = ["title", "url", "thumbnail", "socials", "active"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    const block = await Block.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      updates,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!block) {
      return res.status(404).json({
        success: false,
        message: "Block not found",
      });
    }
    res.status(200).json({
      success: true,
      block,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Could not update block",
    });
  }
}
export async function deleteBlock(req, res) {
  try {
    const block = await Block.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!block) {
      return res.status(404).json({
        success: false,
        message: "Block not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Block deleted",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Could not delete block",
    });
  }
}
export async function duplicateBlock(req, res) {
  try {
    const source = await Block.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!source) {
      return res.status(404).json({
        success: false,
        message: "Block not found",
      });
    }
    const count = await Block.countDocuments({ user: req.user._id });
    const copy = source.toObject();
    delete copy._id;
    delete copy.createdAt;
    delete copy.updatedAt;
    const block = await Block.create({
      ...copy,
      position: count,
    });
    res.status(201).json({
      success: true,
      block,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Could not duplicate block",
    });
  }
}
export async function reorderBlocks(req, res) {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({
        success: false,
        message: "orderedIds must be an array",
      });
    }
    const ownedCount = await Block.countDocuments({
      user: req.user._id,
      _id: { $in: orderedIds },
    });
    if (ownedCount !== orderedIds.length) {
      return res.status(403).json({
        success: false,
        message: "Invalid block list",
      });
    }
    await Promise.all(
      orderedIds.map((id, index) =>
        Block.updateOne({ _id: id, user: req.user._id }, { position: index }),
      ),
    );
    const blocks = await Block.find({ user: req.user._id }).sort({
      position: 1,
    });
    res.status(200).json({
      success: true,
      blocks,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Could not reorder blocks",
    });
  }
}
export async function getPublicBlocks(req, res) {
  try {
    const blocks = await Block.find({
      user: req.params.userId,
      active: true,
    })
      .sort({ position: 1 })
      .select("-user");
    res.status(200).json({
      success: true,
      blocks,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Could not load public blocks",
    });
  }
}
