import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Bus, Home, Map, MapPin, Route as RouteIcon } from "lucide-react";
import { useMockAuth } from "@/hooks/useMockAuth";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/map", label: "Map", icon: Map },
  { to: "/routes", label: "Routes", icon: RouteIcon },
  { to: "/stops", label: "Stops", icon: MapPin },
] as const;

export function PassengerLayout({
  children,
  fullBleed = false,
}: {
  children: ReactNode;
  fullBleed?: boolean;
}) {
  const { user: adminUser } = useMockAuth("admin");
  const { user: driverUser } = useMockAuth("driver");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-[900] border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bus aria-hidden className="size-4" />
            </span>
            SmartTransit
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {NAV.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                activeProps={{ className: "bg-primary-soft text-primary" }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
              >
                {label}
              </Link>
            ))}
            <Link
              to={driverUser ? "/driver" : "/driver/login"}
              className="ml-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
            >
              Driver
            </Link>
            <Link
              to={adminUser ? "/admin" : "/admin/login"}
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main
        className={
          fullBleed
            ? "flex-1 pb-16 md:pb-0"
            : "mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 md:pb-10"
        }
      >
        {children}
      </main>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-[900] border-t border-border bg-card md:hidden"
      >
        <ul className="mx-auto flex max-w-md">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1">
              <Link
                to={to}
                activeOptions={{ exact: to === "/" }}
                activeProps={{ className: "text-primary" }}
                className="flex min-h-14 flex-col items-center justify-center gap-1 py-2 text-xs font-medium text-muted-foreground"
              >
                <Icon aria-hidden className="size-5" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
