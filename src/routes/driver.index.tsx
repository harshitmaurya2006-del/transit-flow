import { useEffect } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Gauge, LogOut, MapPin, Navigation, Satellite } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { FreshnessIndicator } from "@/components/FreshnessIndicator";
import { MapPanel } from "@/components/map/MapPanel";
import { LoadingState, ErrorState } from "@/components/StateViews";
import { Button } from "@/components/ui/button";
import { useBus } from "@/hooks/useBusStream";
import { useMockAuth } from "@/hooks/useMockAuth";
import { DRIVER_BUS_ID, getRoute, getStop, routeStops } from "@/data/transit";
import { transportService } from "@/services/transport";
import { formatEta } from "@/lib/transit-format";

export const Route = createFileRoute("/driver/")({
  head: () => ({
    meta: [
      { title: "Driver Trip Dashboard — SmartTransit" },
      {
        name: "description",
        content:
          "Start and end trips, monitor GPS status, speed and the next stop while your bus broadcasts live location.",
      },
      { property: "og:title", content: "Driver Trip Dashboard — SmartTransit" },
      { property: "og:description", content: "Start your trip and broadcast live GPS to passengers." },
    ],
  }),
  component: DriverDashboard,
});

function DriverDashboard() {
  const { user, ready, logout } = useMockAuth("driver");
  const navigate = useNavigate();
  const { bus, loading, error, retry } = useBus(DRIVER_BUS_ID);

  useEffect(() => {
    if (ready && !user) void navigate({ to: "/driver/login" });
  }, [ready, user, navigate]);

  const route = bus ? getRoute(bus.routeId) : undefined;
  const nextStop = bus?.nextStopId ? getStop(bus.nextStopId) : undefined;
  const stops = route ? routeStops(route) : [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Driver dashboard</p>
            <p className="text-xs text-muted-foreground">{user ?? "--"}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              void navigate({ to: "/driver/login" });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
          >
            <LogOut aria-hidden className="size-4" />
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-5 p-4">
        {loading ? (
          <LoadingState label="Connecting to vehicle GPS..." />
        ) : error || !bus ? (
          <ErrorState message="Unable to reach the vehicle." onRetry={retry} />
        ) : (
          <>
            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-foreground">{bus.label}</h1>
                  <p className="text-sm text-muted-foreground">
                    {route ? `${route.name} · ${route.origin} → ${route.destination}` : bus.routeId}
                  </p>
                </div>
                {bus.tripActive ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1 text-sm font-semibold text-success">
                    <span aria-hidden className="size-2 animate-pulse rounded-full bg-success" />
                    TRIP ACTIVE
                  </span>
                ) : (
                  <StatusBadge status="offline" size="md" />
                )}
              </div>

              <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                <Metric icon={Satellite} label="GPS signal" value={bus.tripActive ? "Strong" : "Standby"} />
                <Metric icon={Gauge} label="Speed" value={`${Math.round(bus.speed)} km/h`} />
                <Metric
                  icon={Navigation}
                  label="ETA next stop"
                  value={bus.tripActive ? formatEta(bus.etaMinutes) : "--"}
                />
              </dl>

              <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-secondary/60 p-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Next stop
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 font-semibold text-foreground">
                    <MapPin aria-hidden className="size-4 text-primary" />
                    {nextStop?.name ?? "--"}
                  </p>
                </div>
                <FreshnessIndicator bus={bus} />
              </div>

              {bus.tripActive ? (
                <Button
                  className="mt-5 h-14 w-full bg-danger text-lg font-bold text-primary-foreground hover:bg-danger/90"
                  onClick={() => transportService.endTrip(bus.id)}
                >
                  END TRIP
                </Button>
              ) : (
                <Button
                  className="mt-5 h-14 w-full text-lg font-bold"
                  onClick={() => transportService.startTrip(bus.id)}
                >
                  START TRIP
                </Button>
              )}
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Starting a trip immediately shows this bus live on the{" "}
                <Link to="/map" className="font-medium text-primary underline">
                  passenger map
                </Link>
                .
              </p>
            </section>

            <section className="h-64 overflow-hidden rounded-2xl border border-border">
              <MapPanel
                buses={[bus]}
                routes={route ? [route] : []}
                stops={stops}
                selectedBusId={bus.id}
                fitToContent
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border p-3">
      <dt className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon aria-hidden className="size-3.5" />
        {label}
      </dt>
      <dd className="mt-1 text-lg font-semibold tabular-nums text-foreground">{value}</dd>
    </div>
  );
}
