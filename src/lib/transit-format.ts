import type { BusStatus, LiveBus } from "@/services/transport";

export type Freshness = "live" | "stale" | "offline";

export function freshnessOf(bus: Pick<LiveBus, "timestamp" | "tripActive">, now = Date.now()): {
  level: Freshness;
  ageSeconds: number;
  label: string;
} {
  const ageSeconds = Math.max(0, Math.round((now - bus.timestamp) / 1000));
  if (!bus.tripActive) return { level: "offline", ageSeconds, label: "Offline" };
  const level: Freshness = ageSeconds <= 15 ? "live" : ageSeconds <= 60 ? "stale" : "offline";
  const labels: Record<Freshness, string> = { live: "Live", stale: "Stale", offline: "Offline" };
  return { level, ageSeconds, label: labels[level] };
}

export function formatAge(seconds: number): string {
  if (seconds < 60) return `${seconds} sec ago`;
  const mins = Math.round(seconds / 60);
  return `${mins} min ago`;
}

export function statusLabel(status: BusStatus, delayMinutes = 0): string {
  if (status === "offline") return "Offline";
  if (status === "delayed") return `Delayed ${delayMinutes} min`;
  return "On Time";
}

export function formatEta(minutes: number): string {
  if (minutes <= 0) return "--";
  if (minutes === 1) return "1 min";
  return `${minutes} min`;
}

export function greeting(hour: number): string {
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}
