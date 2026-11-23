import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
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
      await login(form);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not log in");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f7f5] px-4 py-10">
      <Card className="w-full max-w-md rounded-3xl">
        <CardHeader>
          <Link to="/" className="mb-5 text-xl font-black">
            linkora
          </Link>
          <CardTitle className="text-3xl">Welcome back</CardTitle>
          <p className="text-sm text-neutral-500">
            Log in to manage your Linkora.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-neutral-600"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={updateField}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={submitting}
            >
              {submitting ? "Logging in..." : "Log in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-neutral-500">
            New to Linkora?{" "}
            <Link to="/register" className="font-semibold text-neutral-900">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
