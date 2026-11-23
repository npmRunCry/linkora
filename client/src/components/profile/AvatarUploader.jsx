import { useRef, useState } from "react"
import { Camera } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { useProfile } from "@/context/ProfileContext"

export default function AvatarUploader() {
  const inputRef = useRef(null)
  const { profile, setProfile } = useProfile()
  const [uploading, setUploading] = useState(false)

  async function handleFile(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("avatar", file)

    try {
      setUploading(true)

      const { data } = await api.post("/upload/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setProfile(data.profile)
      toast.success("Profile image updated")
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not upload image")
    } finally {
      setUploading(false)
      event.target.value = ""
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="grid size-20 place-items-center overflow-hidden rounded-full bg-neutral-100 text-2xl font-bold">
        {profile?.avatar ? (
          <img
            src={profile.avatar}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          profile?.displayName?.charAt(0)?.toUpperCase()
        )}
      </div>

      <div>
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Camera />
          {uploading ? "Uploading..." : "Change image"}
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />

        <p className="mt-2 text-xs text-neutral-500">
          JPG, PNG or WebP. Maximum 5 MB.
        </p>
      </div>
    </div>
  )
}
