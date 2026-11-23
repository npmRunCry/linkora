export const themes = {
  minimal: {
    label: "Minimal",
    backgroundType: "color",
    backgroundColor: "#f7f7f5",
    textColor: "#171717",
    buttonColor: "#ffffff",
    buttonTextColor: "#171717",
  },
  midnight: {
    label: "Midnight",
    backgroundType: "color",
    backgroundColor: "#111111",
    textColor: "#ffffff",
    buttonColor: "#262626",
    buttonTextColor: "#ffffff",
  },
  lavender: {
    label: "Lavender",
    backgroundType: "color",
    backgroundColor: "#eee7ff",
    textColor: "#34265f",
    buttonColor: "#ffffff",
    buttonTextColor: "#34265f",
  },
  sunset: {
    label: "Sunset",
    backgroundType: "gradient",
    gradientFrom: "#ffedd5",
    gradientTo: "#fbcfe8",
    textColor: "#431407",
    buttonColor: "#ffffff",
    buttonTextColor: "#431407",
  },
  ocean: {
    label: "Ocean",
    backgroundType: "gradient",
    gradientFrom: "#cffafe",
    gradientTo: "#dbeafe",
    textColor: "#0c4a6e",
    buttonColor: "#ffffff",
    buttonTextColor: "#0c4a6e",
  },
  forest: {
    label: "Forest",
    backgroundType: "color",
    backgroundColor: "#18392b",
    textColor: "#f0fdf4",
    buttonColor: "#285943",
    buttonTextColor: "#f0fdf4",
  },
}

export function getPageBackground(appearance) {
  if (appearance?.backgroundType === "gradient") {
    return {
      background: `linear-gradient(135deg, ${appearance.gradientFrom}, ${appearance.gradientTo})`,
    }
  }

  return {
    background: appearance?.backgroundColor || "#f7f7f5",
  }
}

export function getButtonRadius(radius) {
  if (radius === "square") return "8px"
  if (radius === "pill") return "999px"
  return "18px"
}

export function getButtonStyles(appearance) {
  const base = {
    borderRadius: getButtonRadius(appearance?.buttonRadius),
    color: appearance?.buttonTextColor || "#171717",
  }

  if (appearance?.buttonStyle === "outline") {
    return {
      ...base,
      background: "transparent",
      border: `2px solid ${appearance?.buttonColor || "#ffffff"}`,
    }
  }

  if (appearance?.buttonStyle === "soft") {
    return {
      ...base,
      background: `${appearance?.buttonColor || "#ffffff"}cc`,
      border: "1px solid rgba(255,255,255,0.25)",
      backdropFilter: "blur(8px)",
    }
  }

  return {
    ...base,
    background: appearance?.buttonColor || "#ffffff",
    border: "1px solid transparent",
  }
}

export function getFontFamily(font) {
  const families = {
    inter: "Inter, sans-serif",
    poppins: "Poppins, sans-serif",
    "dm-sans": '"DM Sans", sans-serif',
    "space-grotesk": '"Space Grotesk", sans-serif',
  }

  return families[font] || families.inter
}
