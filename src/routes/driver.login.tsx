import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMockAuth } from "@/hooks/useMockAuth";

export const Route = createFileRoute("/driver/login")({
  head: () => ({
    meta: [
      { title: "Driver Sign In — SmartTransit" },
      {
        name: "description",
        content: "Drivers sign in with their driver ID to start a trip and broadcast live location.",
      },
      { property: "og:title", content: "Driver Sign In — SmartTransit" },
      { property: "og:description", content: "Sign in to start your trip and go live." },
    ],
  }),
  component: DriverLogin,
});

function DriverLogin() {
  const { user, ready, login } = useMockAuth("driver");
  const navigate = useNavigate();
  const [driverId, setDriverId] = useState("DRV-102");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && user) void navigate({ to: "/driver" });
  }, [ready, user, navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Bus aria-hidden className="size-5" />
        </span>
        <h1 className="mt-4 text-xl font-semibold text-foreground">Driver sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Use your driver ID to access the trip dashboard.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!driverId.trim() || !password.trim()) {
              setError("Enter both your driver ID and password.");
              return;
            }
            setError(null);
            login(driverId.trim().toUpperCase());
            void navigate({ to: "/driver" });
          }}
        >
          <div>
            <label htmlFor="driverId" className="text-sm font-medium text-foreground">
              Driver ID
            </label>
            <input
              id="driverId"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
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
          Demo only — any ID works and nothing is sent to a server.
        </p>
      </div>
    </main>
  );
}
