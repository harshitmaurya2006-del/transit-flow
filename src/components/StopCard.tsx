import { ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistance } from "@/lib/geo";
import { formatEta } from "@/lib/transit-format";
import type { Stop } from "@/data/transit";

interface StopCardProps {
  stop: Stop;
  approachingCount: number;
  nextBusMinutes: number | null;
  selected?: boolean;
  onSelect?: (stopId: string) => void;
}

export function StopCard({
  stop,
  approachingCount,
  nextBusMinutes,
  selected,
  onSelect,
}: StopCardProps) {
  const content = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
        <MapPin aria-hidden className="size-5" />
      </span>
      <div className="min-w-0 flex-1 text-left">
        <p className="truncate font-semibold text-foreground">{stop.name}</p>
        <p className="text-sm text-muted-foreground">{formatDistance(stop.distanceM)}</p>
        <p className="mt-2 text-sm text-foreground">
          {approachingCount > 0
            ? `${approachingCount} bus${approachingCount > 1 ? "es" : ""} approaching`
            : "No buses approaching"}
        </p>
        {nextBusMinutes !== null ? (
          <p className="text-sm font-medium text-primary">Next bus: {formatEta(nextBusMinutes)}</p>
        ) : null}
      </div>
      <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
    </>
  );

  const className = cn(
    "flex w-full items-start gap-3 rounded-xl border bg-card p-4 text-left transition-colors",
    selected ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-primary/40",
  );

  if (!onSelect) return <div className={className}>{content}</div>;

  return (
    <button type="button" className={className} onClick={() => onSelect(stop.id)} aria-pressed={selected}>
      {content}
    </button>
  );
}
