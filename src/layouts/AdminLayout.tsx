import { useEffect, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Bus,
  LayoutDashboard,
  LogOut,
  MapPin,
  Radio,
  Route as RouteIcon,
  Users,
} from "lucide-react";
import { useMockAuth } from "@/hooks/useMockAuth";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/fleet", label: "Live Fleet", icon: Radio, exact: false },
  { to: "/admin/buses", label: "Buses", icon: Bus, exact: false },
  { to: "/admin/routes", label: "Routes", icon: RouteIcon, exact: false },
  { to: "/admin/stops", label: "Stops", icon: MapPin, exact: false },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3, exact: false },
] as const;

export function AdminLayout({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const { user, ready, logout } = useMockAuth("admin");
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !user) void navigate({ to: "/admin/login" });
  }, [ready, user, navigate]);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
        <div className="flex h-14 items-center gap-2 border-b border-border px-4 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bus aria-hidden className="size-4" />
          </span>
          SmartTransit
        </div>
        <nav aria-label="Admin" className="flex-1 space-y-1 p-3">
          {NAV.map(({ to, label, icon: Icon, exact }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact }}
              activeProps={{ className: "bg-primary-soft text-primary" }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
            >
              <Icon aria-hidden className="size-4" />
              {label}
            </Link>
          ))}
          <span className="flex cursor-not-allowed items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground/60">
            <Users aria-hidden className="size-4" />
            Drivers
          </span>
        </nav>
        <div className="border-t border-border p-3">
          <p className="px-3 pb-2 text-xs text-muted-foreground">Signed in as {user ?? "--"}</p>
          <button
            type="button"
            onClick={() => {
              logout();
              void navigate({ to: "/admin/login" });
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
          >
            <LogOut aria-hidden className="size-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-border bg-card px-4 py-4 md:px-6">
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
          <nav aria-label="Admin" className="mt-3 flex gap-2 overflow-x-auto md:hidden">
            {NAV.map(({ to, label, exact }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact }}
                activeProps={{ className: "bg-primary-soft text-primary" }}
                className="whitespace-nowrap rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
