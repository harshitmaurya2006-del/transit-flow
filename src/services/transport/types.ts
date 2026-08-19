export type BusStatus = "on_time" | "delayed" | "offline";

/** Payload shape of the future `bus:location_updated` Socket.IO event. */
export interface BusLocationUpdate {
  busId: string;
  latitude: number;
  longitude: number;
  speed: number;
  timestamp: number;
  eta: number;
  status: BusStatus;
}

export interface LiveBus {
  id: string;
  label: string;
  routeId: string;
  driverId: string;
  driverName: string;
  /** Trip started by the driver and GPS transmitting. */
  tripActive: boolean;
  latitude: number;
  longitude: number;
  speed: number;
  /** Epoch ms of the last received location. */
  timestamp: number;
  etaMinutes: number;
  delayMinutes: number;
  status: BusStatus;
  nextStopId: string | null;
  /** 0..1 along the route polyline. */
  progress: number;
}

export interface TransportService {
  getBuses(): LiveBus[];
  subscribe(listener: (buses: LiveBus[]) => void): () => void;
  startTrip(busId: string): void;
  endTrip(busId: string): void;
}
