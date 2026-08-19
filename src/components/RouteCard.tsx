import { Link } from "@tanstack/react-router";
import { ChevronRight, Clock, Route as RouteIcon } from "lucide-react";
import type { TransitRoute } from "@/data/transit";

export function RouteCard({ route, activeBuses }: { route: TransitRoute; activeBuses: number }) {
  return (
    <Link
      to="/route/$id"
      params={{ id: route.id }}
      className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <RouteIcon aria-hidden className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground">{route.name}</p>
        <p className="truncate text-sm text-muted-foreground">
          {route.origin} → {route.destination}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{activeBuses} buses active</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden className="size-3.5" />
            {route.journeyMinutes} min
          </span>
        </div>
      </div>
      <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
    </Link>
  );
}
