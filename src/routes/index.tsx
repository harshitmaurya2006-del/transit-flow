import { useEffect, useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Bus as BusIcon, MapPin, Route as RouteIcon } from "lucide-react";
import { PassengerLayout } from "@/layouts/PassengerLayout";
import { SearchBar } from "@/components/SearchBar";
import { BusCard } from "@/components/BusCard";
import { StopCard } from "@/components/StopCard";
import { CardSkeleton, EmptyState, ErrorState } from "@/components/StateViews";
import { Button } from "@/components/ui/button";
import { useBusStream } from "@/hooks/useBusStream";
import { STOPS } from "@/data/transit";
import { busesApproachingStop, etaToStop, searchTransit } from "@/lib/transit-selectors";
import { greeting } from "@/lib/transit-format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartTransit — Live Bus Tracking & Arrival Times" },
      {
        name: "description",
        content:
          "Find nearby buses, track them live on the map and see accurate arrival times for every stop on your route.",
      },
      { property: "og:title", content: "SmartTransit — Live Bus Tracking & Arrival Times" },
      {
        property: "og:description",
        content: "Find nearby buses, see live locations and know exactly when your bus arrives.",
      },
    ],
  }),
  component: PassengerHome,
});

function PassengerHome() {
  const { buses, loading, error, retry } = useBusStream();
  const [query, setQuery] = useState("");
  const [hour, setHour] = useState<number | null>(null);

  useEffect(() => setHour(new Date().getHours()), []);

  const results = useMemo(() => searchTransit(query), [query]);
  const nearbyBuses = useMemo(
    () => buses.filter((b) => b.tripActive).sort((a, b) => a.etaMinutes - b.etaMinutes).slice(0, 4),
    [buses],
  );
  const nearbyStops = useMemo(() => [...STOPS].sort((a, b) => a.distanceM - b.distanceM).slice(0, 4), []);

  return (
    <PassengerLayout>
      <section className="mb-6">
        <p className="text-sm text-muted-foreground">{hour === null ? "Welcome" : greeting(hour)}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          Where are you going?
        </h1>
        <div className="mt-4">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </section>

      {query.trim() ? (
        <SearchResultsView results={results} />
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <section aria-labelledby="nearby-buses">
            <h2 id="nearby-buses" className="mb-3 text-lg font-semibold text-foreground">
              Nearby Buses
            </h2>
            {loading ? (
              <CardSkeleton />
            ) : error ? (
              <ErrorState onRetry={retry} />
            ) : nearbyBuses.length === 0 ? (
              <EmptyState
                title="No buses nearby."
                description="No buses are currently in service around you."
                action={
                  <Button asChild variant="outline">
                    <Link to="/routes">View All Routes</Link>
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                {nearbyBuses.map((bus) => (
                  <BusCard key={bus.id} bus={bus} />
                ))}
              </div>
            )}
          </section>

          <section aria-labelledby="nearby-stops">
            <h2 id="nearby-stops" className="mb-3 text-lg font-semibold text-foreground">
              Nearby Stops
            </h2>
            {loading ? (
              <CardSkeleton />
            ) : (
              <div className="space-y-3">
                {nearbyStops.map((stop) => {
                  const approaching = busesApproachingStop(buses, stop.id);
                  const first = approaching[0];
                  return (
                    <StopCard
                      key={stop.id}
                      stop={stop}
                      approachingCount={approaching.length}
                      nextBusMinutes={first ? etaToStop(first, stop.id) : null}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </PassengerLayout>
  );
}

function SearchResultsView({ results }: { results: ReturnType<typeof searchTransit> }) {
  const empty =
    results.routes.length === 0 && results.stops.length === 0 && results.buses.length === 0;

  if (empty) {
    return (
      <EmptyState
        title="No matches found."
        description="Try a route number like 102, a bus like BUS-104, or a stop name."
      />
    );
  }

  return (
    <div className="space-y-6">
      {results.routes.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Routes
          </h2>
          <ul className="space-y-2">
            {results.routes.map((route) => (
              <li key={route.id}>
                <Link
                  to="/route/$id"
                  params={{ id: route.id }}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-primary/40"
                >
                  <RouteIcon aria-hidden className="size-4 text-primary" />
                  <span className="font-medium text-foreground">{route.name}</span>
                  <span className="truncate text-sm text-muted-foreground">
                    {route.origin} → {route.destination}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {results.stops.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Stops
          </h2>
          <ul className="space-y-2">
            {results.stops.map((stop) => (
              <li key={stop.id}>
                <Link
                  to="/stops"
                  search={{ stop: stop.id }}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-primary/40"
                >
                  <MapPin aria-hidden className="size-4 text-primary" />
                  <span className="font-medium text-foreground">{stop.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {results.buses.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Buses
          </h2>
          <ul className="space-y-2">
            {results.buses.map((bus) => (
              <li key={bus.id}>
                <Link
                  to="/bus/$id"
                  params={{ id: bus.id }}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-primary/40"
                >
                  <BusIcon aria-hidden className="size-4 text-primary" />
                  <span className="font-medium text-foreground">{bus.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
