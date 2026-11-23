import { useState } from "react"
import { toast } from "sonner"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useProfile } from "@/context/ProfileContext"
import { themes } from "@/lib/appearance"

const fonts = [
  { value: "inter", label: "Inter" },
  { value: "poppins", label: "Poppins" },
  { value: "dm-sans", label: "DM Sans" },
  { value: "space-grotesk", label: "Space Grotesk" },
]

export default function AppearancePage() {
  const { profile, setProfile } = useProfile()
  const [saving, setSaving] = useState(false)

  if (!profile) return null

  const appearance = profile.appearance

  function updateAppearance(field, value) {
    setProfile((current) => ({
      ...current,
      appearance: {
        ...current.appearance,
        [field]: value,
      },
    }))
  }

  function applyTheme(themeKey) {
    const theme = themes[themeKey]

    setProfile((current) => ({
      ...current,
      appearance: {
        ...current.appearance,
        ...theme,
        theme: themeKey,
      },
    }))
  }

  async function saveAppearance() {
    try {
      setSaving(true)

      const { data } = await api.patch(
        "/profile/appearance",
        profile.appearance
      )

      setProfile(data.profile)
      toast.success("Appearance saved")
    } catch {
      toast.error("Could not save appearance")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm text-neutral-500">Design</p>
        <h1 className="text-3xl font-black">Appearance</h1>
      </div>

      <section className="rounded-3xl border bg-white p-5">
        <h2 className="font-bold">Themes</h2>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              type="button"
              onClick={() => applyTheme(key)}
              className="overflow-hidden rounded-2xl border text-left"
            >
              <div
                className="h-24"
                style={
                  theme.backgroundType === "gradient"
                    ? {
                        background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
                      }
                    : {
                        background: theme.backgroundColor,
                      }
                }
              />
              <div className="p-3 text-sm font-semibold">
                {theme.label}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5">
        <h2 className="font-bold">Colors</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ColorField
            label="Background"
            value={appearance.backgroundColor}
            onChange={(value) => {
              updateAppearance("backgroundType", "color")
              updateAppearance("backgroundColor", value)
            }}
          />
          <ColorField
            label="Text"
            value={appearance.textColor}
            onChange={(value) =>
              updateAppearance("textColor", value)
            }
          />
          <ColorField
            label="Button"
            value={appearance.buttonColor}
            onChange={(value) =>
              updateAppearance("buttonColor", value)
            }
          />
          <ColorField
            label="Button text"
            value={appearance.buttonTextColor}
            onChange={(value) =>
              updateAppearance("buttonTextColor", value)
            }
          />
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5">
        <h2 className="font-bold">Buttons</h2>

        <div className="mt-4 space-y-5">
          <ChoiceRow
            label="Style"
            value={appearance.buttonStyle}
            options={["fill", "outline", "soft"]}
            onChange={(value) =>
              updateAppearance("buttonStyle", value)
            }
          />

          <ChoiceRow
            label="Shape"
            value={appearance.buttonRadius}
            options={["square", "rounded", "pill"]}
            onChange={(value) =>
              updateAppearance("buttonRadius", value)
            }
          />
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5">
        <Label htmlFor="font">Font</Label>
        <select
          id="font"
          value={appearance.font}
          onChange={(event) =>
            updateAppearance("font", event.target.value)
          }
          className="mt-2 w-full rounded-xl border bg-white px-3 py-2"
        >
          {fonts.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </section>

      <Button onClick={saveAppearance} disabled={saving}>
        {saving ? "Saving..." : "Save appearance"}
      </Button>
    </div>
  )
}

function ColorField({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-2xl border p-3">
      <span className="text-sm font-medium">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="size-9 cursor-pointer border-0 bg-transparent"
      />
    </label>
  )
}

function ChoiceRow({ label, value, options, onChange }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-full border px-4 py-2 text-sm capitalize ${
              value === option
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "bg-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
