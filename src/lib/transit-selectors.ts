import { BUSES, ROUTES, STOPS, getRoute, type Stop, type TransitRoute } from "@/data/transit";
import type { LiveBus } from "@/services/transport";

/** Buses that will still reach `stopId` on their current trip. */
export function busesApproachingStop(buses: LiveBus[], stopId: string): LiveBus[] {
  return buses
    .filter((bus) => {
      if (!bus.tripActive) return false;
      const route = getRoute(bus.routeId);
      if (!route) return false;
      const target = route.stopIds.indexOf(stopId);
      if (target < 0 || !bus.nextStopId) return false;
      const next = route.stopIds.indexOf(bus.nextStopId);
      return next >= 0 && next <= target;
    })
    .sort((a, b) => a.etaMinutes - b.etaMinutes);
}

/** Approximate ETA to a stop further down the route (adds ~4 min per intermediate stop). */
export function etaToStop(bus: LiveBus, stopId: string): number {
  const route = getRoute(bus.routeId);
  if (!route || !bus.nextStopId) return bus.etaMinutes;
  const next = route.stopIds.indexOf(bus.nextStopId);
  const target = route.stopIds.indexOf(stopId);
  if (next < 0 || target < 0 || target <= next) return bus.etaMinutes;
  return bus.etaMinutes + (target - next) * 4;
}

export function activeBusesOnRoute(buses: LiveBus[], routeId: string): LiveBus[] {
  return buses.filter((b) => b.routeId === routeId && b.tripActive);
}

export interface SearchResults {
  routes: TransitRoute[];
  stops: Stop[];
  buses: { id: string; label: string; routeId: string }[];
}

export function searchTransit(query: string): SearchResults {
  const q = query.trim().toLowerCase();
  if (!q) return { routes: [], stops: [], buses: [] };
  return {
    routes: ROUTES.filter(
      (r) =>
        r.code.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.origin.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q),
    ),
    stops: STOPS.filter((s) => s.name.toLowerCase().includes(q)),
    buses: BUSES.filter((b) => b.label.toLowerCase().includes(q)).map((b) => ({
      id: b.id,
      label: b.label,
      routeId: b.routeId,
    })),
  };
}

export function fleetSummary(buses: LiveBus[]) {
  const active = buses.filter((b) => b.tripActive);
  return {
    active: active.length,
    delayed: active.filter((b) => b.status === "delayed").length,
    offline: buses.filter((b) => !b.tripActive).length,
    averageDelay: active.length
      ? Math.round((active.reduce((sum, b) => sum + b.delayMinutes, 0) / active.length) * 10) / 10
      : 0,
  };
}
