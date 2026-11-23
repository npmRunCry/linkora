import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      await register(form);
      toast.success("Welcome to Linkora");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create account");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[f7f7f7] px-4 py-10">
      <Card className="w-full max-w-md rounded-3xl">
        <CardHeader>
          <Link to="/" className="mb-5 text-xl font-black">
            Linkora
          </Link>
          <CardTitle className="text-3xl">Create your page</CardTitle>
          <p className="text-sm text-neutral-500">
            Claim your username and start building.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Aryaman"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={form.username}
                onChange={updateField}
                placeholder="aryaman"
                autoCapitalize="none"
                required
              />
              <p className="text-xs text-neutral-500">
                Your page will be linkora.app/{form.username || "username"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={updateField}
                placeholder="Maximum 6 characters"
                minLength = {6}
                required
              />
            </div>

            <Button
            type="submit"
            className="w-full rounded-full"
            disabled={submitting}
            >
                {submitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">Already have an account? {" "}
            <Link to="/login" className="font-semibold text-neutral-900">Log In</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
