import { Suspense, lazy } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { TransitMapProps } from "./TransitMap";

const TransitMap = lazy(() => import("./TransitMap"));

function MapSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      className={cn("flex size-full items-center justify-center bg-muted", className)}
    >
      <p className="text-sm text-muted-foreground">Loading live map...</p>
    </div>
  );
}

/** Browser-only map wrapper — Leaflet must never be imported during SSR. */
export function MapPanel({ className, ...props }: TransitMapProps & { className?: string }) {
  return (
    <div className={cn("relative size-full overflow-hidden", className)}>
      <ClientOnly fallback={<MapSkeleton />}>
        <Suspense fallback={<MapSkeleton />}>
          <TransitMap {...props} />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
