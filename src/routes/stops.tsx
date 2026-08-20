import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { PassengerLayout } from "@/layouts/PassengerLayout";
import { StopCard } from "@/components/StopCard";
import { StatusBadge } from "@/components/StatusBadge";
import { CardSkeleton, EmptyState, ErrorState } from "@/components/StateViews";
import { useBusStream } from "@/hooks/useBusStream";
import { STOPS, getRoute, getStop } from "@/data/transit";
import { busesApproachingStop, etaToStop } from "@/lib/transit-selectors";
import { formatEta } from "@/lib/transit-format";

export const Route = createFileRoute("/stops")({
  validateSearch: (search: Record<string, unknown>) => ({
    stop: typeof search.stop === "string" ? search.stop : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Nearby Stops & Arrivals — SmartTransit" },
      {
        name: "description",
        content:
          "See the closest bus stops, how far they are and which buses are approaching with live arrival times.",
      },
      { property: "og:title", content: "Nearby Stops & Arrivals — SmartTransit" },
      {
        property: "og:description",
        content: "Closest stops, walking distance and live approaching buses.",
      },
    ],
  }),
  component: StopsPage,
});

function StopsPage() {
  const { stop: initialStop } = Route.useSearch();
  const { buses, loading, error, retry } = useBusStream();
  const [selectedId, setSelectedId] = useState<string | null>(initialStop ?? null);

  const sorted = [...STOPS].sort((a, b) => a.distanceM - b.distanceM);
  const selected = selectedId ? getStop(selectedId) : undefined;
  const approaching = selected ? busesApproachingStop(buses, selected.id) : [];

  return (
    <PassengerLayout>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Nearby Stops</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Tap a stop to see every bus approaching it.
      </p>

      {error ? (
        <ErrorState className="mt-6" onRetry={retry} />
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-3">
            {loading ? (
              <CardSkeleton count={4} />
            ) : (
              sorted.map((stop) => {
                const list = busesApproachingStop(buses, stop.id);
                return (
                  <StopCard
                    key={stop.id}
                    stop={stop}
                    approachingCount={list.length}
                    nextBusMinutes={list[0] ? etaToStop(list[0], stop.id) : null}
                    selected={stop.id === selectedId}
                    onSelect={setSelectedId}
                  />
                );
              })
            )}
          </div>

          <aside className="lg:sticky lg:top-20 lg:h-fit">
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="font-semibold text-foreground">
                {selected ? selected.name : "Select a stop"}
              </h2>
              {!selected ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose a stop from the list to see approaching buses.
                </p>
              ) : approaching.length === 0 ? (
                <EmptyState
                  className="mt-3 border-0 bg-transparent p-2"
                  title="No buses approaching."
                  description="Check back shortly or view the live map."
                />
              ) : (
                <ul className="mt-3 space-y-2">
                  {approaching.map((bus) => {
                    const route = getRoute(bus.routeId);
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
                              {route?.name}
                            </span>
                          </span>
                          <span className="text-right">
                            <span className="block font-semibold text-primary">
                              {formatEta(etaToStop(bus, selected.id))}
                            </span>
                            <StatusBadge status={bus.status} delayMinutes={bus.delayMinutes} />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </aside>
        </div>
      )}
    </PassengerLayout>
  );
}
