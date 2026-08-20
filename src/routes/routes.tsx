import { createFileRoute } from "@tanstack/react-router";
import { PassengerLayout } from "@/layouts/PassengerLayout";
import { RouteCard } from "@/components/RouteCard";
import { CardSkeleton, ErrorState } from "@/components/StateViews";
import { useBusStream } from "@/hooks/useBusStream";
import { ROUTES } from "@/data/transit";
import { activeBusesOnRoute } from "@/lib/transit-selectors";

export const Route = createFileRoute("/routes")({
  head: () => ({
    meta: [
      { title: "All Bus Routes — SmartTransit" },
      {
        name: "description",
        content:
          "Browse every bus route in the network with journey times, stops served and how many buses are running right now.",
      },
      { property: "og:title", content: "All Bus Routes — SmartTransit" },
      {
        property: "og:description",
        content: "Every route in the network with live bus counts and journey times.",
      },
    ],
  }),
  component: RoutesPage,
});

function RoutesPage() {
  const { buses, loading, error, retry } = useBusStream();

  return (
    <PassengerLayout>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Routes</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {ROUTES.length} routes serving the city network.
      </p>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        {loading ? (
          <CardSkeleton />
        ) : error ? (
          <ErrorState onRetry={retry} />
        ) : (
          ROUTES.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              activeBuses={activeBusesOnRoute(buses, route.id).length}
            />
          ))
        )}
      </div>
    </PassengerLayout>
  );
}
