import { StatusBadge } from "@/components/StatusBadge";
import { FreshnessIndicator } from "@/components/FreshnessIndicator";
import { getStop } from "@/data/transit";
import type { LiveBus } from "@/services/transport";

/** ETA is the most prominent piece of information on a bus screen. */
export function ETACard({ bus }: { bus: LiveBus }) {
  const nextStop = bus.nextStopId ? getStop(bus.nextStopId) : undefined;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="text-sm font-medium text-muted-foreground">Arriving in</p>
      <p className="mt-1 text-5xl font-bold tracking-tight text-foreground tabular-nums">
        {bus.tripActive ? bus.etaMinutes : "--"}
        <span className="ml-2 text-2xl font-semibold text-muted-foreground">min</span>
      </p>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Next stop
          </dt>
          <dd className="mt-1 font-semibold text-foreground">{nextStop?.name ?? "--"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Status
          </dt>
          <dd className="mt-1">
            <StatusBadge status={bus.status} delayMinutes={bus.delayMinutes} size="md" />
          </dd>
        </div>
      </dl>
      <FreshnessIndicator bus={bus} className="mt-4" />
    </div>
  );
}
