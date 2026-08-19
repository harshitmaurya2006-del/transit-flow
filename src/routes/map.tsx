import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { PassengerLayout } from "@/layouts/PassengerLayout";
import { MapPanel } from "@/components/map/MapPanel";
import { BottomSheet } from "@/components/BottomSheet";
import { SearchBar } from "@/components/SearchBar";
import { StatusBadge } from "@/components/StatusBadge";
import { FreshnessIndicator } from "@/components/FreshnessIndicator";
import { ErrorState } from "@/components/StateViews";
import { Button } from "@/components/ui/button";
import { useBusStream } from "@/hooks/useBusStream";
import { ROUTES, getRoute, getStop } from "@/data/transit";
import { formatEta } from "@/lib/transit-format";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Live Bus Map — SmartTransit" },
      {
        name: "description",
        content:
          "Watch buses move in real time on an interactive map, with stops, routes and live arrival estimates.",
      },
      { property: "og:title", content: "Live Bus Map — SmartTransit" },
      {
        property: "og:description",
        content: "Watch buses move in real time on an interactive map of the city network.",
      },
    ],
  }),
  component: LiveMapPage,
});

function LiveMapPage() {
  const { buses, error, retry } = useBusStream();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const visibleBuses = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return buses;
    return buses.filter((b) => {
      const route = getRoute(b.routeId);
      return (
        b.label.toLowerCase().includes(q) ||
        route?.code.includes(q) ||
        route?.name.toLowerCase().includes(q)
      );
    });
  }, [buses, query]);

  const selected = buses.find((b) => b.id === selectedId) ?? null;
  const selectedRoute = selected ? getRoute(selected.routeId) : undefined;
  const nextStop = selected?.nextStopId ? getStop(selected.nextStopId) : undefined;

  return (
    <PassengerLayout fullBleed>
      <div className="relative h-[calc(100vh-3.5rem-4rem)] md:h-[calc(100vh-3.5rem)]">
        <div className="absolute inset-x-0 top-0 z-[900] p-3">
          <div className="mx-auto max-w-xl">
            <SearchBar value={query} onChange={setQuery} placeholder="Search buses or routes" />
          </div>
        </div>

        {error ? (
          <div className="flex size-full items-center justify-center p-4">
            <ErrorState onRetry={retry} />
          </div>
        ) : (
          <MapPanel
            buses={visibleBuses.filter((b) => b.tripActive)}
            routes={ROUTES}
            selectedBusId={selectedId}
            onSelectBus={setSelectedId}
            showUser
          />
        )}

        <BottomSheet
          open={Boolean(selected)}
          onClose={() => setSelectedId(null)}
          title="Selected bus details"
        >
          {selected ? (
            <div>
              <p className="text-sm text-muted-foreground">{selected.label}</p>
              <h2 className="text-lg font-semibold text-foreground">
                {selectedRoute?.name ?? selected.routeId}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedRoute ? `${selectedRoute.origin} → ${selectedRoute.destination}` : ""}
              </p>
              <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">
                {formatEta(selected.etaMinutes)}
              </p>
              <p className="text-sm text-foreground">Next stop: {nextStop?.name ?? "--"}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <StatusBadge status={selected.status} delayMinutes={selected.delayMinutes} />
                <FreshnessIndicator bus={selected} />
              </div>
              <Button asChild className="mt-4 w-full">
                <Link to="/bus/$id" params={{ id: selected.id }}>
                  View bus details
                </Link>
              </Button>
            </div>
          ) : null}
        </BottomSheet>
      </div>
    </PassengerLayout>
  );
}
