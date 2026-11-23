import crypto from "crypto"
import { UAParser } from "ua-parser-js"

export function getOrCreateVisitorId(req, res) {
  let visitorId = req.cookies.linkora_visitor

  if (!visitorId) {
    visitorId = crypto.randomUUID()

    res.cookie("linkora_visitor", visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    })
  }

  return visitorId
}

export function getDeviceAndBrowser(req) {
  const parser = new UAParser(req.headers["user-agent"])
  const result = parser.getResult()

  let device = "Desktop"

  if (result.device.type === "mobile") {
    device = "Mobile"
  } else if (result.device.type === "tablet") {
    device = "Tablet"
  }

  return {
    device,
    browser: result.browser.name || "Unknown",
  }
}

export function getReferrer(req) {
  const raw = req.get("referer") || req.get("referrer")

  if (!raw) return "Direct"

  try {
    const hostname = new URL(raw).hostname.replace("www.", "")

    if (hostname.includes("google.")) return "Google"
    if (hostname.includes("instagram.com")) return "Instagram"
    if (hostname.includes("youtube.com")) return "YouTube"
    if (hostname.includes("t.co") || hostname.includes("x.com")) return "X"
    if (hostname.includes("linkedin.com")) return "LinkedIn"
    if (hostname.includes("facebook.com")) return "Facebook"

    return hostname
  } catch {
    return "Direct"
  }
}

export function getCountry(req) {
  return (
    req.headers["cf-ipcountry"] ||
    req.headers["x-vercel-ip-country"] ||
    req.headers["x-country-code"] ||
    "Unknown"
  )
}

export function getRequestAnalytics(req, res) {
  const visitorId = getOrCreateVisitorId(req, res)
  const { device, browser } = getDeviceAndBrowser(req)

  return {
    visitorId,
    device,
    browser,
    referrer: getReferrer(req),
    country: getCountry(req),
  }
}
