import { Link } from "@tanstack/react-router";
import { Bus, ChevronRight, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { FreshnessIndicator } from "@/components/FreshnessIndicator";
import { getRoute, getStop } from "@/data/transit";
import { formatEta } from "@/lib/transit-format";
import type { LiveBus } from "@/services/transport";

export function BusCard({ bus }: { bus: LiveBus }) {
  const route = getRoute(bus.routeId);
  const nextStop = bus.nextStopId ? getStop(bus.nextStopId) : undefined;

  return (
    <Link
      to="/bus/$id"
      params={{ id: bus.id }}
      className="block rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 focus-visible:border-primary"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Bus aria-hidden className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-foreground">{route?.name ?? bus.routeId}</p>
            <span className="text-xs text-muted-foreground">{bus.label}</span>
          </div>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {route ? `${route.origin} → ${route.destination}` : "Route unavailable"}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-sm font-semibold text-foreground">
              {bus.tripActive ? `Arriving in ${formatEta(bus.etaMinutes)}` : "Not in service"}
            </span>
            <StatusBadge status={bus.status} delayMinutes={bus.delayMinutes} />
          </div>
          {nextStop ? (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin aria-hidden className="size-3.5" />
              Next stop: {nextStop.name}
            </p>
          ) : null}
          <FreshnessIndicator bus={bus} className="mt-2" />
        </div>
        <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
      </div>
    </Link>
  );
}
