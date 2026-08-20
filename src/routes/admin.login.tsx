import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMockAuth } from "@/hooks/useMockAuth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — SmartTransit" },
      {
        name: "description",
        content: "Transport operators sign in to monitor the live fleet, routes, stops and delays.",
      },
      { property: "og:title", content: "Admin Sign In — SmartTransit" },
      { property: "og:description", content: "Sign in to the SmartTransit operations console." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const { user, ready, login } = useMockAuth("admin");
  const navigate = useNavigate();
  const [email, setEmail] = useState("ops@smarttransit.app");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && user) void navigate({ to: "/admin" });
  }, [ready, user, navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <ShieldCheck aria-hidden className="size-5" />
        </span>
        <h1 className="mt-4 text-xl font-semibold text-foreground">Operations sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Monitor the fleet in real time.</p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.trim() || !password.trim()) {
              setError("Enter your email and password.");
              return;
            }
            setError(null);
            login(email.trim());
            void navigate({ to: "/admin" });
          }}
        >
          <div>
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" className="h-11 w-full">
            Sign in
          </Button>
        </form>
        <p className="mt-4 text-xs text-muted-foreground">
          Demo only — credentials are not verified against a server.
        </p>
      </div>
    </main>
  );
}
