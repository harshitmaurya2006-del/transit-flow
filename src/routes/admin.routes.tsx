import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { ROUTES, STOPS, getStop, type TransitRoute } from "@/data/transit";

export const Route = createFileRoute("/admin/routes")({
  head: () => ({
    meta: [
      { title: "Manage Routes — SmartTransit Admin" },
      {
        name: "description",
        content: "Edit route stop sequences: add, remove and reorder stops and review end-to-end journey time.",
      },
      { property: "og:title", content: "Manage Routes — SmartTransit Admin" },
      { property: "og:description", content: "Edit route stop sequences and journey times." },
    ],
  }),
  component: RoutesAdminPage,
});

function RoutesAdminPage() {
  const [routes, setRoutes] = useState<TransitRoute[]>(ROUTES);
  const [selectedId, setSelectedId] = useState(ROUTES[0]?.id ?? "");
  const selected = routes.find((r) => r.id === selectedId);

  function updateStops(stopIds: string[]) {
    setRoutes((prev) => prev.map((r) => (r.id === selectedId ? { ...r, stopIds } : r)));
  }

  function move(index: number, delta: number) {
    if (!selected) return;
    const next = [...selected.stopIds];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    const a = next[index]!;
    const b = next[target]!;
    next[index] = b;
    next[target] = a;
    updateStops(next);
  }

  return (
    <AdminLayout title="Routes" description="Stop sequence defines the path drawn on every map.">
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav aria-label="Routes" className="space-y-2">
          {routes.map((route) => (
            <button
              key={route.id}
              type="button"
              onClick={() => setSelectedId(route.id)}
              aria-pressed={route.id === selectedId}
              className={`w-full rounded-xl border p-3 text-left ${
                route.id === selectedId ? "border-primary bg-primary-soft" : "border-border bg-card"
              }`}
            >
              <span className="block font-medium text-foreground">{route.name}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {route.origin} → {route.destination}
              </span>
            </button>
          ))}
        </nav>

        {selected ? (
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-semibold text-foreground">{selected.name}</h2>
            <p className="text-sm text-muted-foreground">
              {selected.stopIds.length} stops · {selected.journeyMinutes} min end-to-end
            </p>

            <ol className="mt-4 space-y-2">
              {selected.stopIds.map((stopId, i) => (
                <li
                  key={stopId}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                >
                  <span className="min-w-0 truncate font-medium text-foreground">
                    {i + 1}. {getStop(stopId)?.name ?? stopId}
                  </span>
                  <span className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="icon" aria-label="Move up" onClick={() => move(i, -1)}>
                      <ArrowUp aria-hidden className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Move down" onClick={() => move(i, 1)}>
                      <ArrowDown aria-hidden className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Remove stop"
                      onClick={() => updateStops(selected.stopIds.filter((s) => s !== stopId))}
                    >
                      <X aria-hidden className="size-4" />
                    </Button>
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <label htmlFor="add-stop" className="text-sm font-medium text-muted-foreground">
                Add stop
              </label>
              <select
                id="add-stop"
                value=""
                onChange={(e) => {
                  if (e.target.value) updateStops([...selected.stopIds, e.target.value]);
                }}
                className="h-9 rounded-lg border border-border bg-background px-2 text-sm"
              >
                <option value="">Select a stop...</option>
                {STOPS.filter((s) => !selected.stopIds.includes(s.id)).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </section>
        ) : null}
      </div>
    </AdminLayout>
  );
}
