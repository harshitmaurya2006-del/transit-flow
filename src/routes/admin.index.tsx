import { Link, createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Bus, Route as RouteIcon, WifiOff } from "lucide-react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { KpiCard } from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";
import { MapPanel } from "@/components/map/MapPanel";
import { CardSkeleton, ErrorState } from "@/components/StateViews";
import { useBusStream } from "@/hooks/useBusStream";
import { fleetSummary } from "@/lib/transit-selectors";
import { ROUTES, getRoute, getStop } from "@/data/transit";
import { formatEta } from "@/lib/transit-format";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Fleet Overview — SmartTransit Admin" },
      {
        name: "description",
        content:
          "Operations dashboard with active, delayed and offline buses, a live fleet map and a delay summary by route.",
      },
      { property: "og:title", content: "Fleet Overview — SmartTransit Admin" },
      { property: "og:description", content: "Live KPIs, fleet map and delay summary for operators." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { buses, loading, error, retry } = useBusStream();
  const summary = fleetSummary(buses);
  const activeRoutes = ROUTES.filter((r) => r.active).length;

  return (
    <AdminLayout title="Fleet overview" description="Live status across the whole network.">
      {loading ? (
        <CardSkeleton count={4} />
      ) : error ? (
        <ErrorState onRetry={retry} />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Active buses" value={summary.active} icon={Bus} tone="success" />
            <KpiCard
              label="Delayed"
              value={summary.delayed}
              icon={AlertTriangle}
              tone="warning"
              hint={`Avg delay ${summary.averageDelay} min`}
            />
            <KpiCard label="Offline" value={summary.offline} icon={WifiOff} tone="danger" />
            <KpiCard label="Active routes" value={activeRoutes} icon={RouteIcon} tone="primary" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <section className="h-[420px] overflow-hidden rounded-xl border border-border">
              <MapPanel buses={buses} routes={ROUTES} fitToContent />
            </section>

            <section className="rounded-xl border border-border bg-card p-4">
              <h2 className="font-semibold text-foreground">Recent bus status</h2>
              <ul className="mt-3 space-y-2">
                {buses.map((bus) => {
                  const route = getRoute(bus.routeId);
                  const nextStop = bus.nextStopId ? getStop(bus.nextStopId) : undefined;
                  return (
                    <li key={bus.id}>
                      <Link
                        to="/bus/$id"
                        params={{ id: bus.id }}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 hover:border-primary/40"
                      >
                        <span className="min-w-0">
                          <span className="block font-medium text-foreground">{bus.label}</span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {route?.name} · {nextStop?.name ?? "Not in service"}
                          </span>
                        </span>
                        <span className="text-right">
                          <StatusBadge status={bus.status} delayMinutes={bus.delayMinutes} />
                          <span className="mt-1 block text-xs text-muted-foreground">
                            ETA {bus.tripActive ? formatEta(bus.etaMinutes) : "--"}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
