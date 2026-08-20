import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/AdminLayout";
import { DataTable, type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { BUSES, getRoute, type BusRecord } from "@/data/transit";

export const Route = createFileRoute("/admin/buses")({
  head: () => ({
    meta: [
      { title: "Manage Buses — SmartTransit Admin" },
      {
        name: "description",
        content: "Add, edit and disable vehicles in the fleet, with route assignment, driver and capacity.",
      },
      { property: "og:title", content: "Manage Buses — SmartTransit Admin" },
      { property: "og:description", content: "Fleet vehicle registry with route and driver assignment." },
    ],
  }),
  component: BusesPage,
});

function BusesPage() {
  const [rows, setRows] = useState<BusRecord[]>(BUSES);
  const [draft, setDraft] = useState<BusRecord | null>(null);

  const columns: Column<BusRecord>[] = [
    { key: "label", header: "Bus", render: (b) => <span className="font-medium text-foreground">{b.label}</span> },
    { key: "route", header: "Route", render: (b) => getRoute(b.routeId)?.name ?? b.routeId },
    { key: "driver", header: "Driver", render: (b) => `${b.driverName} (${b.driverId})` },
    { key: "capacity", header: "Capacity", render: (b) => b.capacity },
    {
      key: "state",
      header: "State",
      render: (b) => (
        <span className={b.active ? "text-success" : "text-muted-foreground"}>
          {b.active ? "In service" : "Disabled"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (b) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setDraft(b)}>
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setRows((prev) => prev.map((r) => (r.id === b.id ? { ...r, active: !r.active } : r)))
            }
          >
            {b.active ? "Disable" : "Enable"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Buses" description="Vehicle registry for the network.">
      <div className="mb-4 flex justify-end">
        <Button
          onClick={() =>
            setDraft({
              id: `BUS-${100 + rows.length + 1}`,
              label: `BUS-${100 + rows.length + 1}`,
              routeId: "R1",
              driverName: "",
              driverId: "",
              capacity: 40,
              active: true,
            })
          }
        >
          Add bus
        </Button>
      </div>

      <DataTable caption="Buses" columns={columns} rows={rows} emptyTitle="No buses registered yet." />

      {draft ? (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-foreground/40 p-4">
          <div role="dialog" aria-label="Bus details" className="w-full max-w-sm rounded-2xl border border-border bg-card p-5">
            <h2 className="font-semibold text-foreground">
              {rows.some((r) => r.id === draft.id) ? "Edit bus" : "Add bus"}
            </h2>
            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                setRows((prev) =>
                  prev.some((r) => r.id === draft.id)
                    ? prev.map((r) => (r.id === draft.id ? draft : r))
                    : [...prev, draft],
                );
                setDraft(null);
              }}
            >
              <Field label="Bus label" value={draft.label} onChange={(v) => setDraft({ ...draft, label: v })} />
              <div>
                <label htmlFor="routeId" className="text-sm font-medium text-foreground">
                  Route
                </label>
                <select
                  id="routeId"
                  value={draft.routeId}
                  onChange={(e) => setDraft({ ...draft, routeId: e.target.value })}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-2 text-sm"
                >
                  {["R1", "R2", "R3"].map((id) => (
                    <option key={id} value={id}>
                      {getRoute(id)?.name ?? id}
                    </option>
                  ))}
                </select>
              </div>
              <Field
                label="Driver name"
                value={draft.driverName}
                onChange={(v) => setDraft({ ...draft, driverName: v })}
              />
              <Field
                label="Driver ID"
                value={draft.driverId}
                onChange={(v) => setDraft({ ...draft, driverId: v })}
              />
              <Field
                label="Capacity"
                value={String(draft.capacity)}
                onChange={(v) => setDraft({ ...draft, capacity: Number(v) || 0 })}
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setDraft(null)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-2 text-sm"
      />
    </div>
  );
}
