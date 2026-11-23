import {
  Github,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-brands";
import { toast } from "sonner"
import api from "@/lib/api"

const socialIcons = {
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  github: Github,
  x: ({ className }) => (
    <span className={className}>X</span>
  ),
}

function youtubeEmbedUrl(url) {
  try {
    const parsed = new URL(url)

    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`
    }

    const videoId = parsed.searchParams.get("v")
    return videoId
      ? `https://www.youtube.com/embed/${videoId}`
      : ""
  } catch {
    return ""
  }
}

export default function PublicBlock({ block, buttonClass, style }) {
  if (block.type === "heading") {
    return (
      <h3 className="pt-4 text-center text-sm font-bold uppercase tracking-[0.16em]">
        {block.title}
      </h3>
    )
  }

  if (block.type === "socials") {
    return (
      <div className="flex flex-wrap justify-center gap-3 py-2">
        {block.socials.map((social) => {
          const Icon = socialIcons[social.platform]

          if (!Icon) return null

          return (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="grid size-10 place-items-center rounded-full border border-current/20"
            >
              <Icon className="size-5" />
            </a>
          )
        })}
      </div>
    )
  }

  if (block.type === "youtube") {
    const embedUrl = youtubeEmbedUrl(block.url)

    if (!embedUrl) return null

    return (
      <div className="overflow-hidden rounded-2xl">
        <iframe
          className="aspect-video w-full"
          src={embedUrl}
          title={block.title || "YouTube video"}
          allowFullScreen
        />
      </div>
    )
  }

  async function openTrackedLink() {
    const newTab = window.open("", "_blank")

    try {
      const { data } = await api.post(`/analytics/click/${block._id}`)

      if (newTab) {
        newTab.location = data.url
      } else {
        window.location.href = data.url
      }
    } catch {
      if (newTab) {
        newTab.close()
      }
      toast.error("Could not open this link")
    }
  }

  return (
    <button
      type="button"
      onClick={openTrackedLink}
      className={buttonClass}
      style={style}
    >
      {block.title}
    </button>
  )
}
