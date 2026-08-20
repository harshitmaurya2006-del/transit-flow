import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PassengerLayout } from "@/layouts/PassengerLayout";
import { ETACard } from "@/components/ETACard";
import { StopTimeline } from "@/components/StopTimeline";
import { MapPanel } from "@/components/map/MapPanel";
import { CardSkeleton, EmptyState, ErrorState } from "@/components/StateViews";
import { Button } from "@/components/ui/button";
import { useBus } from "@/hooks/useBusStream";
import { getRoute, routeStops } from "@/data/transit";

export const Route = createFileRoute("/bus/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.id} Live Tracking — SmartTransit` },
      {
        name: "description",
        content: `Track ${params.id} live: current position, next stop, arrival estimate and progress along its route.`,
      },
      { property: "og:title", content: `${params.id} Live Tracking — SmartTransit` },
      {
        property: "og:description",
        content: `Live position, next stop and arrival time for ${params.id}.`,
      },
    ],
  }),
  component: BusDetailPage,
  errorComponent: () => (
    <PassengerLayout>
      <ErrorState message="We couldn't load this bus." />
    </PassengerLayout>
  ),
});

function BusDetailPage() {
  const { id } = Route.useParams();
  const { bus, loading, error, retry } = useBus(id);
  const route = bus ? getRoute(bus.routeId) : undefined;
  const stops = route ? routeStops(route) : [];
  const activeIndex = bus?.nextStopId ? route?.stopIds.indexOf(bus.nextStopId) : undefined;

  return (
    <PassengerLayout>
      <Link
        to="/map"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Back to map
      </Link>

      {loading ? (
        <CardSkeleton />
      ) : error ? (
        <ErrorState className="mt-4" onRetry={retry} />
      ) : !bus ? (
        <EmptyState
          className="mt-4"
          title="Bus not found."
          description={`No live bus matches ${id}.`}
          action={
            <Button asChild variant="outline">
              <Link to="/map">Open live map</Link>
            </Button>
          }
        />
      ) : (
        <>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">{bus.label}</h1>
          <p className="text-sm text-muted-foreground">
            {route ? `${route.name} · ${route.origin} → ${route.destination}` : bus.routeId}
          </p>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="space-y-5">
              <ETACard bus={bus} />
              <div className="h-64 overflow-hidden rounded-2xl border border-border">
                <MapPanel
                  buses={[bus]}
                  routes={route ? [route] : []}
                  stops={stops}
                  selectedBusId={bus.id}
                  fitToContent
                />
              </div>
            </div>

            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="mb-4 font-semibold text-foreground">Route progress</h2>
              <StopTimeline stops={stops} activeIndex={activeIndex ?? undefined} />
            </section>
          </div>
        </>
      )}
    </PassengerLayout>
  );
}
