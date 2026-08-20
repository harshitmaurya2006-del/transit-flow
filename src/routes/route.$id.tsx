import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { PassengerLayout } from "@/layouts/PassengerLayout";
import { BusCard } from "@/components/BusCard";
import { StopTimeline } from "@/components/StopTimeline";
import { MapPanel } from "@/components/map/MapPanel";
import { EmptyState, ErrorState } from "@/components/StateViews";
import { Button } from "@/components/ui/button";
import { useBusStream } from "@/hooks/useBusStream";
import { getRoute, routeStops } from "@/data/transit";
import { activeBusesOnRoute } from "@/lib/transit-selectors";

export const Route = createFileRoute("/route/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Route ${params.id} Stops & Live Buses — SmartTransit` },
      {
        name: "description",
        content: `All stops served on route ${params.id}, journey time and every bus currently running on it.`,
      },
      { property: "og:title", content: `Route ${params.id} — SmartTransit` },
      {
        property: "og:description",
        content: `Stop-by-stop timeline and live buses for route ${params.id}.`,
      },
    ],
  }),
  component: RouteDetailPage,
  errorComponent: () => (
    <PassengerLayout>
      <ErrorState message="We couldn't load this route." />
    </PassengerLayout>
  ),
});

function RouteDetailPage() {
  const { id } = Route.useParams();
  const { buses, error, retry } = useBusStream();
  const route = getRoute(id);
  const stops = route ? routeStops(route) : [];
  const active = route ? activeBusesOnRoute(buses, route.id) : [];

  if (!route) {
    return (
      <PassengerLayout>
        <EmptyState
          title="Route not found."
          description={`No route matches ${id}.`}
          action={
            <Button asChild variant="outline">
              <Link to="/routes">All routes</Link>
            </Button>
          }
        />
      </PassengerLayout>
    );
  }

  return (
    <PassengerLayout>
      <Link
        to="/routes"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden className="size-4" />
        All routes
      </Link>

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">{route.name}</h1>
      <p className="text-sm text-muted-foreground">
        {route.origin} → {route.destination}
      </p>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock aria-hidden className="size-4" />
          {route.journeyMinutes} min end-to-end
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin aria-hidden className="size-4" />
          {stops.length} stops
        </span>
      </div>

      {error ? <ErrorState className="mt-5" onRetry={retry} /> : null}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="h-64 overflow-hidden rounded-2xl border border-border">
            <MapPanel buses={active} routes={[route]} stops={stops} fitToContent />
          </div>
          <section>
            <h2 className="mb-3 font-semibold text-foreground">Active buses</h2>
            {active.length === 0 ? (
              <EmptyState
                title="No buses running."
                description="No bus is currently in service on this route."
              />
            ) : (
              <div className="space-y-3">
                {active.map((bus) => (
                  <BusCard key={bus.id} bus={bus} />
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-semibold text-foreground">Stops</h2>
          <StopTimeline stops={stops} />
        </section>
      </div>
    </PassengerLayout>
  );
}
