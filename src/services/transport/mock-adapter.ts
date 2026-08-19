import { BUSES, ROUTES, getRoute, routePath } from "@/data/transit";
import { cumulativeDistances, distanceToIndex, pointAtProgress, type Point } from "@/lib/geo";
import type { LiveBus, TransportService } from "./types";

const TICK_MS = 3000;

interface SimState extends LiveBus {
  /** km/h used to advance the bus along its polyline. */
  cruiseSpeed: number;
  /** Seconds of trip time before this bus starts accumulating delay (null = never). */
  delayAfterS: number | null;
  elapsedS: number;
}

const SEED: Record<string, Partial<SimState>> = {
  "BUS-101": { progress: 0.12, tripActive: true, cruiseSpeed: 30, delayMinutes: 0, delayAfterS: null },
  "BUS-102": { progress: 0, tripActive: false, cruiseSpeed: 28, delayMinutes: 0, delayAfterS: 30 },
  "BUS-103": { progress: 0.44, tripActive: true, cruiseSpeed: 26, delayMinutes: 2, delayAfterS: null },
  "BUS-104": { progress: 0.68, tripActive: true, cruiseSpeed: 18, delayMinutes: 11, delayAfterS: null },
  "BUS-105": { progress: 0.3, tripActive: false, cruiseSpeed: 0, delayMinutes: 0, delayAfterS: null },
};

function pathFor(routeId: string): Point[] {
  const route = getRoute(routeId);
  return route ? (routePath(route) as Point[]) : [];
}

function totalLength(path: Point[]): number {
  const cum = cumulativeDistances(path);
  return cum[cum.length - 1] ?? 1;
}

function buildState(): SimState[] {
  const now = Date.now();
  return BUSES.map((bus) => {
    const seed = SEED[bus.id] ?? {};
    const path = pathFor(bus.routeId);
    const progress = seed.progress ?? 0;
    const at = pointAtProgress(path, progress);
    const route = getRoute(bus.routeId);
    const state: SimState = {
      id: bus.id,
      label: bus.label,
      routeId: bus.routeId,
      driverId: bus.driverId,
      driverName: bus.driverName,
      tripActive: seed.tripActive ?? false,
      latitude: at.lat,
      longitude: at.lng,
      speed: seed.tripActive ? (seed.cruiseSpeed ?? 25) : 0,
      timestamp: seed.tripActive ? now : now - 5 * 60_000,
      etaMinutes: 0,
      delayMinutes: seed.delayMinutes ?? 0,
      status: "offline",
      nextStopId: route?.stopIds[at.nextIndex] ?? null,
      progress,
      cruiseSpeed: seed.cruiseSpeed ?? 25,
      delayAfterS: seed.delayAfterS ?? null,
      elapsedS: 0,
    };
    return recompute(state);
  });
}

function recompute(state: SimState): SimState {
  const route = getRoute(state.routeId);
  const path = pathFor(state.routeId);
  const at = pointAtProgress(path, state.progress);
  const nextStopId = route?.stopIds[at.nextIndex] ?? null;
  const remainingM = distanceToIndex(path, state.progress, at.nextIndex);
  const speed = state.tripActive ? state.cruiseSpeed : 0;
  const etaMinutes = state.tripActive
    ? Math.max(1, Math.round(remainingM / 1000 / Math.max(speed, 8) * 60) + state.delayMinutes)
    : 0;
  const status = !state.tripActive ? "offline" : state.delayMinutes >= 5 ? "delayed" : "on_time";
  return {
    ...state,
    latitude: at.lat,
    longitude: at.lng,
    speed,
    nextStopId,
    etaMinutes,
    status,
  };
}

function advance(state: SimState): SimState {
  if (!state.tripActive) return state;
  const path = pathFor(state.routeId);
  const total = totalLength(path);
  const metres = (state.cruiseSpeed * 1000 * (TICK_MS / 1000)) / 3600;
  let progress = state.progress + metres / total;
  if (progress >= 1) progress = 0; // loop the route for the demo
  const elapsedS = state.elapsedS + TICK_MS / 1000;
  let delayMinutes = state.delayMinutes;
  if (state.delayAfterS !== null && elapsedS > state.delayAfterS) {
    delayMinutes = Math.min(14, Math.round((elapsedS - state.delayAfterS) / 10) + 4);
  }
  return recompute({
    ...state,
    progress,
    elapsedS,
    delayMinutes,
    timestamp: Date.now(),
  });
}

function toLiveBus(state: SimState): LiveBus {
  const {
    cruiseSpeed: _cruiseSpeed,
    delayAfterS: _delayAfterS,
    elapsedS: _elapsedS,
    ...live
  } = state;
  return live;
}

class MockTransportService implements TransportService {
  private state: SimState[] = buildState();
  private listeners = new Set<(buses: LiveBus[]) => void>();
  private timer: ReturnType<typeof setInterval> | null = null;

  getBuses(): LiveBus[] {
    return this.state.map(toLiveBus);
  }

  subscribe(listener: (buses: LiveBus[]) => void) {
    this.listeners.add(listener);
    listener(this.getBuses());
    this.start();
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) this.stop();
    };
  }

  startTrip(busId: string) {
    this.state = this.state.map((b) =>
      b.id === busId
        ? recompute({ ...b, tripActive: true, elapsedS: 0, delayMinutes: 0, timestamp: Date.now() })
        : b,
    );
    this.emit();
  }

  endTrip(busId: string) {
    this.state = this.state.map((b) =>
      b.id === busId ? recompute({ ...b, tripActive: false, delayMinutes: 0, elapsedS: 0 }) : b,
    );
    this.emit();
  }

  private start() {
    if (this.timer || typeof window === "undefined") return;
    this.timer = setInterval(() => {
      this.state = this.state.map(advance);
      this.emit();
    }, TICK_MS);
  }

  private stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private emit() {
    const buses = this.getBuses();
    this.listeners.forEach((l) => l(buses));
  }
}

export const mockTransportService: TransportService = new MockTransportService();
export const ACTIVE_ROUTE_COUNT = ROUTES.filter((r) => r.active).length;
