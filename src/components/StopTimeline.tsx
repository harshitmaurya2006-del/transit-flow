import { cn } from "@/lib/utils";
import type { Stop } from "@/data/transit";

interface StopTimelineProps {
  stops: Stop[];
  /** Index of the next stop the bus will reach; earlier stops render as passed. */
  activeIndex?: number | undefined;
  className?: string;
}

export function StopTimeline({ stops, activeIndex, className }: StopTimelineProps) {
  return (
    <ol className={cn("relative", className)}>
      {stops.map((stop, i) => {
        const passed = activeIndex !== undefined && i < activeIndex;
        const current = activeIndex !== undefined && i === activeIndex;
        return (
          <li key={stop.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                aria-hidden
                className={cn(
                  "mt-1.5 size-3 rounded-full border-2",
                  current
                    ? "border-primary bg-primary ring-4 ring-primary/20"
                    : passed
                      ? "border-primary bg-primary"
                      : "border-border bg-card",
                )}
              />
              {i < stops.length - 1 ? (
                <span
                  aria-hidden
                  className={cn("w-0.5 flex-1", passed ? "bg-primary" : "bg-border")}
                  style={{ minHeight: 24 }}
                />
              ) : null}
            </div>
            <div className="pb-4">
              <p
                className={cn(
                  "text-sm",
                  current ? "font-semibold text-primary" : "font-medium text-foreground",
                )}
              >
                {stop.name}
              </p>
              {current ? <p className="text-xs text-muted-foreground">Next stop</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
