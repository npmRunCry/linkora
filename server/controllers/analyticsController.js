import mongoose from "mongoose"
import Block from "../models/Block.js"
import LinkClick from "../models/LinkClick.js"
import PageView from "../models/PageView.js"
import { getRequestAnalytics } from "../utils/analytics.js"

function getStartDate(days) {
  const safeDays = [7, 30, 90].includes(Number(days))
    ? Number(days)
    : 30

  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - (safeDays - 1))

  return {
    days: safeDays,
    start,
  }
}

export async function trackClick(req, res) {
  try {
    const block = await Block.findOne({
      _id: req.params.blockId,
      type: "link",
      active: true,
    })

    if (!block) {
      return res.status(404).json({
        success: false,
        message: "Link not found",
      })
    }

    const analytics = getRequestAnalytics(req, res)

    await LinkClick.create({
      user: block.user,
      block: block._id,
      ...analytics,
    })

    res.status(200).json({
      success: true,
      url: block.url,
    })
  } catch {
    res.status(500).json({
      success: false,
      message: "Could not open link",
    })
  }
}

export async function getAnalyticsOverview(req, res) {
  try {
    const { days, start } = getStartDate(req.query.days)

    const userId = new mongoose.Types.ObjectId(req.user._id)

    const [
      totalViews,
      totalClicks,
      uniqueVisitors,
      topLinks,
      devices,
      browsers,
      referrers,
      countries,
      viewSeries,
      clickSeries,
    ] = await Promise.all([
      PageView.countDocuments({
        user: userId,
        createdAt: { $gte: start },
      }),

      LinkClick.countDocuments({
        user: userId,
        createdAt: { $gte: start },
      }),

      PageView.distinct("visitorId", {
        user: userId,
        createdAt: { $gte: start },
      }),

      LinkClick.aggregate([
        {
          $match: {
            user: userId,
            createdAt: { $gte: start },
          },
        },
        {
          $group: {
            _id: "$block",
            clicks: { $sum: 1 },
          },
        },
        {
          $sort: {
            clicks: -1,
          },
        },
        {
          $limit: 5,
        },
        {
          $lookup: {
            from: "blocks",
            localField: "_id",
            foreignField: "_id",
            as: "block",
          },
        },
        {
          $unwind: "$block",
        },
        {
          $project: {
            _id: 0,
            blockId: "$_id",
            title: "$block.title",
            clicks: 1,
          },
        },
      ]),

      groupField(PageView, userId, start, "$device"),
      groupField(PageView, userId, start, "$browser"),
      groupField(PageView, userId, start, "$referrer"),
      groupField(PageView, userId, start, "$country"),

      dailySeries(PageView, userId, start),
      dailySeries(LinkClick, userId, start),
    ])

    const chart = buildChart(days, viewSeries, clickSeries)

    const ctr =
      totalViews > 0
        ? Number(((totalClicks / totalViews) * 100).toFixed(2))
        : 0

    res.status(200).json({
      success: true,
      range: days,
      summary: {
        views: totalViews,
        clicks: totalClicks,
        ctr,
        uniqueVisitors: uniqueVisitors.length,
      },
      chart,
      topLinks,
      devices,
      browsers,
      referrers,
      countries,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Could not load analytics",
    })
  }
}

function groupField(Model, userId, start, field) {
  return Model.aggregate([
    {
      $match: {
        user: userId,
        createdAt: { $gte: start },
      },
    },
    {
      $group: {
        _id: field,
        value: { $sum: 1 },
      },
    },
    {
      $sort: {
        value: -1,
      },
    },
    {
      $limit: 8,
    },
    {
      $project: {
        _id: 0,
        name: {
          $cond: [
            {
              $or: [
                { $eq: ["$_id", null] },
                { $eq: ["$_id", ""] },
              ],
            },
            "Unknown",
            "$_id",
          ],
        },
        value: 1,
      },
    },
  ])
}

function dailySeries(Model, userId, start) {
  return Model.aggregate([
    {
      $match: {
        user: userId,
        createdAt: { $gte: start },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        value: { $sum: 1 },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ])
}

function buildChart(days, views, clicks) {
  const viewMap = new Map(
    views.map((item) => [item._id, item.value])
  )
  const clickMap = new Map(
    clicks.map((item) => [item._id, item.value])
  )

  const result = []

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - index)

    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-")

    result.push({
      date: key,
      views: viewMap.get(key) || 0,
      clicks: clickMap.get(key) || 0,
    })
  }

  return result
}