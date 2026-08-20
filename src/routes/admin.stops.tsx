import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/AdminLayout";
import { DataTable, type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { STOPS, ROUTES, type Stop } from "@/data/transit";

export const Route = createFileRoute("/admin/stops")({
  head: () => ({
    meta: [
      { title: "Manage Stops — SmartTransit Admin" },
      {
        name: "description",
        content: "Maintain the stop registry: names, coordinates, routes served and whether a stop is in use.",
      },
      { property: "og:title", content: "Manage Stops — SmartTransit Admin" },
      { property: "og:description", content: "Stop registry with coordinates and served routes." },
    ],
  }),
  component: StopsAdminPage,
});

function StopsAdminPage() {
  const [rows, setRows] = useState<Stop[]>(STOPS);

  const columns: Column<Stop>[] = [
    { key: "name", header: "Stop", render: (s) => <span className="font-medium text-foreground">{s.name}</span> },
    {
      key: "coords",
      header: "Coordinates",
      render: (s) => (
        <span className="tabular-nums text-muted-foreground">
          {s.lat.toFixed(4)}, {s.lng.toFixed(4)}
        </span>
      ),
    },
    {
      key: "routes",
      header: "Routes served",
      render: (s) =>
        ROUTES.filter((r) => r.stopIds.includes(s.id))
          .map((r) => r.code)
          .join(", ") || "--",
    },
    {
      key: "state",
      header: "State",
      render: (s) => (
        <span className={s.active ? "text-success" : "text-muted-foreground"}>
          {s.active ? "Active" : "Disabled"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (s) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setRows((prev) => prev.map((r) => (r.id === s.id ? { ...r, active: !r.active } : r)))}
        >
          {s.active ? "Disable" : "Enable"}
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout title="Stops" description="Every stop served by the network.">
      <DataTable caption="Stops" columns={columns} rows={rows} emptyTitle="No stops configured yet." />
    </AdminLayout>
  );
}
