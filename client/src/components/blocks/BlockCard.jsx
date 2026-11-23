import { useEffect, useState } from "react"
import {
  Copy,
  GripVertical,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProfile } from "@/context/ProfileContext"

export default function BlockCard({
  block,
  dragHandleProps,
  dragHandleListeners,
}) {
  const { setBlocks } = useProfile()
  const [draft, setDraft] = useState(block)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraft(block)
  }, [block])

  function updateDraft(field, value) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }))

    setBlocks((current) =>
      current.map((item) =>
        item._id === block._id
          ? { ...item, [field]: value }
          : item
      )
    )
  }

  async function saveBlock() {
    try {
      setSaving(true)

      const { data } = await api.patch(`/blocks/${block._id}`, {
        title: draft.title,
        url: draft.url,
        active: draft.active,
        socials: draft.socials,
      })

      setBlocks((current) =>
        current.map((item) =>
          item._id === block._id ? data.block : item
        )
      )
      toast.success("Block saved")
    } catch {
      toast.error("Could not save block")
    } finally {
      setSaving(false)
    }
  }

  async function deleteBlock() {
    try {
      await api.delete(`/blocks/${block._id}`)
      setBlocks((current) =>
        current.filter((item) => item._id !== block._id)
      )
      toast.success("Block deleted")
    } catch {
      toast.error("Could not delete block")
    }
  }

  async function duplicateBlock() {
    try {
      const { data } = await api.post(`/blocks/${block._id}/duplicate`)
      setBlocks((current) => [...current, data.block])
      toast.success("Block duplicated")
    } catch {
      toast.error("Could not duplicate block")
    }
  }

  return (
    <article className="rounded-3xl border bg-white p-4">
      <div className="flex gap-3">
        <button
          type="button"
          className="mt-2 cursor-grab text-neutral-400 active:cursor-grabbing"
          {...dragHandleProps}
          {...dragHandleListeners}
        >
          <GripVertical className="size-5" />
        </button>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold uppercase">
              {block.type}
            </span>

            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(event) =>
                  updateDraft("active", event.target.checked)
                }
              />
              Active
            </label>
          </div>

          <Input
            value={draft.title}
            onChange={(event) =>
              updateDraft("title", event.target.value)
            }
            placeholder={
              block.type === "heading" ? "Heading" : "Title"
            }
          />

          {(block.type === "link" || block.type === "youtube") && (
            <Input
              value={draft.url}
              onChange={(event) =>
                updateDraft("url", event.target.value)
              }
              placeholder={
                block.type === "youtube"
                  ? "https://youtube.com/watch?v=..."
                  : "https://example.com"
              }
            />
          )}

          {block.type === "socials" && (
            <SocialFields
              socials={draft.socials || []}
              onChange={(socials) =>
                updateDraft("socials", socials)
              }
            />
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={saveBlock}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={duplicateBlock}
            >
              <Copy />
              Duplicate
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={deleteBlock}
            >
              <Trash2 />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

function SocialFields({ socials, onChange }) {
  const platforms = ["instagram", "youtube", "x", "linkedin", "github"]

  function setPlatform(platform, url) {
    const withoutPlatform = socials.filter(
      (item) => item.platform !== platform
    )

    if (!url.trim()) {
      onChange(withoutPlatform)
      return
    }

    onChange([
      ...withoutPlatform,
      {
        platform,
        url,
      },
    ])
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {platforms.map((platform) => {
        const value =
          socials.find((item) => item.platform === platform)?.url || ""

        return (
          <Input
            key={platform}
            value={value}
            onChange={(event) =>
              setPlatform(platform, event.target.value)
            }
            placeholder={`${platform} URL`}
          />
        )
      })}
    </div>
  )
}
