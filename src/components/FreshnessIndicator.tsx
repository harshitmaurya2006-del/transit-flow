import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatAge, freshnessOf } from "@/lib/transit-format";
import type { LiveBus } from "@/services/transport";

const TONE = {
  live: "text-success",
  stale: "text-warning",
  offline: "text-danger",
} as const;

const DOT = {
  live: "bg-success",
  stale: "bg-warning",
  offline: "bg-danger",
} as const;

/** "Live · 4 sec ago" freshness readout, updated once per second on the client. */
export function FreshnessIndicator({
  bus,
  className,
}: {
  bus: Pick<LiveBus, "timestamp" | "tripActive">;
  className?: string;
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const { level, ageSeconds, label } = freshnessOf(bus, now ?? bus.timestamp);

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", TONE[level], className)}>
      <span aria-hidden className={cn("size-2 rounded-full", DOT[level])} />
      <span>
        {label}
        {level !== "offline" && now !== null ? ` · ${formatAge(ageSeconds)}` : ""}
      </span>
    </span>
  );
}
