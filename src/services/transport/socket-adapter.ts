/**
 * Socket.IO adapter placeholder.
 *
 * When the Express + Socket.IO backend is ready:
 *   1. `bun add socket.io-client`
 *   2. Fill in the body below using the same `TransportService` contract.
 *   3. Point `services/transport/index.ts` at `socketTransportService`.
 *
 * Expected server event: `bus:location_updated`
 *   { busId, latitude, longitude, speed, timestamp, eta, status }
 */
import type { LiveBus, TransportService } from "./types";

export function createSocketTransportService(_url: string): TransportService {
  const listeners = new Set<(buses: LiveBus[]) => void>();
  let buses: LiveBus[] = [];

  // const socket = io(_url);
  // socket.on("bus:location_updated", (payload: BusLocationUpdate) => { ...merge...; emit(); });

  return {
    getBuses: () => buses,
    subscribe(listener) {
      listeners.add(listener);
      listener(buses);
      return () => listeners.delete(listener);
    },
    startTrip(_busId) {
      // socket.emit("trip:start", { busId });
    },
    endTrip(_busId) {
      // socket.emit("trip:end", { busId });
    },
  };
}
