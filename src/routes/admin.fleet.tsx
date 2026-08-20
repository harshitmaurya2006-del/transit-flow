import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/AdminLayout";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { MapPanel } from "@/components/map/MapPanel";
import { CardSkeleton, ErrorState } from "@/components/StateViews";
import { useBusStream } from "@/hooks/useBusStream";
import { ROUTES, getRoute } from "@/data/transit";
import { formatEta } from "@/lib/transit-format";
import type { LiveBus } from "@/services/transport";

export const Route = createFileRoute("/admin/fleet")({
  head: () => ({
    meta: [
      { title: "Live Fleet Monitor — SmartTransit Admin" },
      {
        name: "description",
        content:
          "Track every vehicle on one map and sortable table: route, driver, status and arrival estimate updated live.",
      },
      { property: "og:title", content: "Live Fleet Monitor — SmartTransit Admin" },
      { property: "og:description", content: "Every vehicle on one live map and table." },
    ],
  }),
  component: FleetPage,
});

type SortKey = "label" | "route" | "status" | "eta";

function FleetPage() {
  const { buses, loading, error, retry } = useBusStream();
  const navigate = useNavigate();
  const [sort, setSort] = useState<SortKey>("label");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const copy = [...buses];
    copy.sort((a, b) => {
      if (sort === "route") return a.routeId.localeCompare(b.routeId);
      if (sort === "status") return a.status.localeCompare(b.status);
      if (sort === "eta") return (a.tripActive ? a.etaMinutes : 999) - (b.tripActive ? b.etaMinutes : 999);
      return a.label.localeCompare(b.label);
    });
    return copy;
  }, [buses, sort]);

  const columns: Column<LiveBus>[] = [
    { key: "label", header: "Bus", render: (b) => <span className="font-medium text-foreground">{b.label}</span> },
    { key: "route", header: "Route", render: (b) => getRoute(b.routeId)?.name ?? b.routeId },
    { key: "driver", header: "Driver", render: (b) => b.driverName },
    {
      key: "status",
      header: "Status",
      render: (b) => <StatusBadge status={b.status} delayMinutes={b.delayMinutes} />,
    },
    {
      key: "eta",
      header: "ETA",
      render: (b) => (
        <span className="tabular-nums">{b.tripActive ? formatEta(b.etaMinutes) : "--"}</span>
      ),
    },
  ];

  return (
    <AdminLayout title="Live fleet" description="Positions refresh every few seconds.">
      {loading ? (
        <CardSkeleton count={4} />
      ) : error ? (
        <ErrorState onRetry={retry} />
      ) : (
        <div className="space-y-6">
          <section className="h-[380px] overflow-hidden rounded-xl border border-border">
            <MapPanel
              buses={buses}
              routes={ROUTES}
              selectedBusId={selectedId}
              onSelectBus={setSelectedId}
              fitToContent
            />
          </section>

          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-muted-foreground">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-9 rounded-lg border border-border bg-card px-2 text-sm"
            >
              <option value="label">Bus</option>
              <option value="route">Route</option>
              <option value="status">Status</option>
              <option value="eta">ETA</option>
            </select>
          </div>

          <DataTable
            caption="Live fleet"
            columns={columns}
            rows={rows}
            onRowClick={(bus) => void navigate({ to: "/bus/$id", params: { id: bus.id } })}
          />
        </div>
      )}
    </AdminLayout>
  );
}
