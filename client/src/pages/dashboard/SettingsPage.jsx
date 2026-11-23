import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, setUser } = useAuth()

  const [account, setAccount] = useState({
    name: "",
    email: "",
    username: "",
  })
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  })
  const [savingAccount, setSavingAccount] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    if (user) {
      setAccount({
        name: user.name,
        email: user.email,
        username: user.username,
      })
    }
  }, [user])

  function updateAccountField(event) {
    const { name, value } = event.target
    setAccount((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function saveAccount(event) {
    event.preventDefault()

    try {
      setSavingAccount(true)
      const { data } = await api.patch("/users/account", account)
      setUser(data.user)
      toast.success("Account updated")
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not update account"
      )
    } finally {
      setSavingAccount(false)
    }
  }

  async function savePassword(event) {
    event.preventDefault()

    try {
      setSavingPassword(true)
      await api.patch("/users/password", passwords)
      setPasswords({
        currentPassword: "",
        newPassword: "",
      })
      toast.success("Password updated")
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not update password"
      )
    } finally {
      setSavingPassword(false)
    }
  }

  async function deleteAccount() {
    const confirmed = window.confirm(
      "Delete your Linkora account permanently? This cannot be undone."
    )

    if (!confirmed) return

    try {
      await api.delete("/users/account")
      setUser(null)
      toast.success("Account deleted")
      navigate("/")
    } catch {
      toast.error("Could not delete account")
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm text-neutral-500">Account</p>
        <h1 className="text-3xl font-black">Settings</h1>
      </div>

      <form
        onSubmit={saveAccount}
        className="space-y-4 rounded-3xl border bg-white p-5"
      >
        <div>
          <h2 className="font-bold">Account details</h2>
          <p className="text-sm text-neutral-500">
            Your username controls your public URL.
          </p>
        </div>

        <Field
          label="Name"
          name="name"
          value={account.name}
          onChange={updateAccountField}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          value={account.email}
          onChange={updateAccountField}
        />
        <Field
          label="Username"
          name="username"
          value={account.username}
          onChange={updateAccountField}
        />

        <Button type="submit" disabled={savingAccount}>
          {savingAccount ? "Saving..." : "Save account"}
        </Button>
      </form>

      <form
        onSubmit={savePassword}
        className="space-y-4 rounded-3xl border bg-white p-5"
      >
        <div>
          <h2 className="font-bold">Password</h2>
          <p className="text-sm text-neutral-500">
            Choose a password with at least 6 characters.
          </p>
        </div>

        <Field
          label="Current password"
          name="currentPassword"
          type="password"
          value={passwords.currentPassword}
          onChange={(event) =>
            setPasswords((current) => ({
              ...current,
              currentPassword: event.target.value,
            }))
          }
        />
        <Field
          label="New password"
          name="newPassword"
          type="password"
          value={passwords.newPassword}
          onChange={(event) =>
            setPasswords((current) => ({
              ...current,
              newPassword: event.target.value,
            }))
          }
        />

        <Button type="submit" disabled={savingPassword}>
          {savingPassword ? "Updating..." : "Change password"}
        </Button>
      </form>

      <section className="rounded-3xl border border-red-200 bg-red-50 p-5">
        <h2 className="font-bold text-red-700">Danger zone</h2>
        <p className="mt-1 text-sm text-red-700/70">
          Deleting your account removes your profile, blocks and analytics.
        </p>
        <Button
          type="button"
          variant="destructive"
          className="mt-4"
          onClick={deleteAccount}
        >
          Delete account
        </Button>
      </section>
    </div>
  )
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  )
}
