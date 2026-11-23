import { useEffect, useState } from "react"
import { toast } from "sonner"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useProfile } from "@/context/ProfileContext"
import AvatarUploader from "@/components/profile/AvatarUploader"

export default function ProfileEditor() {
  const { profile, setProfile } = useProfile()

  const [form, setForm] = useState({
    displayName: "",
    bio: "",
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setForm({
        displayName: profile.displayName || "",
        bio: profile.bio || "",
      })
    }
  }, [profile])

  function updateField(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setProfile((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function saveProfile() {
    try {
      setSaving(true)
      const { data } = await api.patch("/profile/me", form)
      setProfile(data.profile)
      toast.success("Profile saved")
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save profile")
    } finally {
      setSaving(false)
    }
  }

  if (!profile) return null

  return (
    <section className="rounded-3xl border bg-white p-5">
      <div>
        <h2 className="text-lg font-bold">Profile</h2>
        <p className="text-sm text-neutral-500">
          This information appears at the top of your page.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <AvatarUploader />

        <div className="space-y-2">
          <Label htmlFor="displayName">Display name</Label>
          <Input
            id="displayName"
            name="displayName"
            value={form.displayName}
            onChange={updateField}
            maxLength={50}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="bio">Bio</Label>
            <span className="text-xs text-neutral-400">
              {form.bio.length}/160
            </span>
          </div>
          <Textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={updateField}
            maxLength={160}
            rows={3}
          />
        </div>

        <Button onClick={saveProfile} disabled={saving}>
          {saving ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </section>
  )
}
