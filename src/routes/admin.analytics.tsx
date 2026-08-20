import { createFileRoute } from "@tanstack/react-router";
import { Bus, Clock, Gauge, TrendingDown } from "lucide-react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { KpiCard } from "@/components/KpiCard";
import { CardSkeleton, ErrorState } from "@/components/StateViews";
import { useBusStream } from "@/hooks/useBusStream";
import { fleetSummary } from "@/lib/transit-selectors";
import { BUSES, ROUTES, getRoute } from "@/data/transit";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Network Analytics — SmartTransit Admin" },
      {
        name: "description",
        content:
          "Average delay, most delayed route, fleet utilisation and journey times computed from live vehicle data.",
      },
      { property: "og:title", content: "Network Analytics — SmartTransit Admin" },
      { property: "og:description", content: "Delay, utilisation and journey-time metrics for the network." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { buses, loading, error, retry } = useBusStream();
  const summary = fleetSummary(buses);

  const perRoute = ROUTES.map((route) => {
    const onRoute = buses.filter((b) => b.routeId === route.id && b.tripActive);
    const avgDelay = onRoute.length
      ? Math.round((onRoute.reduce((s, b) => s + b.delayMinutes, 0) / onRoute.length) * 10) / 10
      : 0;
    return { route, active: onRoute.length, avgDelay };
  });

  const mostDelayed = [...perRoute].sort((a, b) => b.avgDelay - a.avgDelay)[0];
  const utilisation = Math.round((summary.active / Math.max(BUSES.length, 1)) * 100);
  const avgJourney = Math.round(
    ROUTES.reduce((s, r) => s + r.journeyMinutes, 0) / Math.max(ROUTES.length, 1),
  );
  const maxDelay = Math.max(1, ...perRoute.map((p) => p.avgDelay));
  const maxActive = Math.max(1, ...perRoute.map((p) => p.active));

  return (
    <AdminLayout title="Analytics" description="Derived from the live vehicle stream.">
      {loading ? (
        <CardSkeleton count={4} />
      ) : error ? (
        <ErrorState onRetry={retry} />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Average delay" value={`${summary.averageDelay} min`} icon={Clock} tone="warning" />
            <KpiCard
              label="Most delayed route"
              value={mostDelayed?.route.code ?? "--"}
              icon={TrendingDown}
              tone="danger"
              hint={mostDelayed ? `${mostDelayed.avgDelay} min average` : undefined}
            />
            <KpiCard label="Fleet utilisation" value={`${utilisation}%`} icon={Gauge} tone="primary" />
            <KpiCard label="Avg journey time" value={`${avgJourney} min`} icon={Bus} tone="neutral" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Chart
              title="Average delay by route (min)"
              data={perRoute.map((p) => ({ label: p.route.code, value: p.avgDelay }))}
              max={maxDelay}
              barClass="bg-warning"
            />
            <Chart
              title="Active buses by route"
              data={perRoute.map((p) => ({ label: p.route.code, value: p.active }))}
              max={maxActive}
              barClass="bg-primary"
            />
          </div>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-semibold text-foreground">Route breakdown</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {perRoute.map(({ route, active, avgDelay }) => (
                <li key={route.id} className="flex items-center justify-between gap-3 border-b border-border pb-2 last:border-0">
                  <span className="text-foreground">{getRoute(route.id)?.name}</span>
                  <span className="text-muted-foreground">
                    {active} active · {avgDelay} min avg delay
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </AdminLayout>
  );
}

function Chart({
  title,
  data,
  max,
  barClass,
}: {
  title: string;
  data: { label: string; value: number }[];
  max: number;
  barClass: string;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-semibold text-foreground">{title}</h2>
      <ul className="mt-4 space-y-3">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-3">
            <span className="w-10 shrink-0 text-sm font-medium text-muted-foreground">{d.label}</span>
            <span className="h-3 flex-1 overflow-hidden rounded-full bg-secondary">
              <span
                className={`block h-full rounded-full transition-all duration-500 ${barClass}`}
                style={{ width: `${Math.round((d.value / max) * 100)}%` }}
              />
            </span>
            <span className="w-10 shrink-0 text-right text-sm tabular-nums text-foreground">{d.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
