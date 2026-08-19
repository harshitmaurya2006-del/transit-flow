/**
 * Static reference data for the SmartTransit prototype.
 * Replace these exports with API calls (services/transport/api.ts) later —
 * nothing in the UI imports this file directly except through services.
 */

export interface Stop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** Walking distance from the mocked user position, in metres. */
  distanceM: number;
  active: boolean;
}

export interface TransitRoute {
  id: string;
  code: string;
  name: string;
  origin: string;
  destination: string;
  stopIds: string[];
  /** Minutes end-to-end. */
  journeyMinutes: number;
  active: boolean;
}

export interface BusRecord {
  id: string;
  label: string;
  routeId: string;
  driverName: string;
  driverId: string;
  capacity: number;
  active: boolean;
}

export const STOPS: Stop[] = [
  { id: "rajpur-road", name: "Rajpur Road", lat: 30.3629, lng: 78.07, distanceM: 250, active: true },
  { id: "jakhan", name: "Jakhan", lat: 30.352, lng: 78.064, distanceM: 1100, active: true },
  { id: "dilaram", name: "Dilaram Chowk", lat: 30.339, lng: 78.056, distanceM: 1900, active: true },
  { id: "sahastradhara", name: "Sahastradhara Crossing", lat: 30.348, lng: 78.074, distanceM: 2400, active: true },
  { id: "clock-tower", name: "Clock Tower", lat: 30.3255, lng: 78.043, distanceM: 700, active: true },
  { id: "ballupur", name: "Ballupur Chowk", lat: 30.3345, lng: 78.0083, distanceM: 3100, active: true },
  { id: "gandhi-road", name: "Gandhi Road", lat: 30.319, lng: 78.033, distanceM: 1500, active: true },
  { id: "railway-station", name: "Railway Station", lat: 30.3165, lng: 78.0322, distanceM: 1750, active: true },
  { id: "saharanpur-chowk", name: "Saharanpur Chowk", lat: 30.312, lng: 78.023, distanceM: 2600, active: true },
  { id: "prince-chowk", name: "Prince Chowk", lat: 30.3175, lng: 78.029, distanceM: 2050, active: true },
  { id: "isbt", name: "ISBT", lat: 30.287, lng: 78.006, distanceM: 5400, active: true },
];

export const ROUTES: TransitRoute[] = [
  {
    id: "R1",
    code: "102",
    name: "Route 102",
    origin: "Rajpur Road",
    destination: "ISBT",
    stopIds: ["rajpur-road", "dilaram", "clock-tower", "gandhi-road", "railway-station", "prince-chowk", "isbt"],
    journeyMinutes: 32,
    active: true,
  },
  {
    id: "R2",
    code: "215",
    name: "Route 215",
    origin: "Sahastradhara Crossing",
    destination: "ISBT",
    stopIds: ["sahastradhara", "jakhan", "dilaram", "clock-tower", "ballupur", "isbt"],
    journeyMinutes: 38,
    active: true,
  },
  {
    id: "R3",
    code: "308",
    name: "Route 308",
    origin: "Ballupur Chowk",
    destination: "Railway Station",
    stopIds: ["ballupur", "clock-tower", "saharanpur-chowk", "prince-chowk", "railway-station"],
    journeyMinutes: 24,
    active: true,
  },
];

export const BUSES: BusRecord[] = [
  { id: "BUS-101", label: "BUS-101", routeId: "R1", driverName: "Rahul Negi", driverId: "DRV-101", capacity: 42, active: true },
  { id: "BUS-102", label: "BUS-102", routeId: "R1", driverName: "Aman Rawat", driverId: "DRV-102", capacity: 42, active: true },
  { id: "BUS-103", label: "BUS-103", routeId: "R2", driverName: "Ravi Bisht", driverId: "DRV-103", capacity: 36, active: true },
  { id: "BUS-104", label: "BUS-104", routeId: "R2", driverName: "Sunil Thapa", driverId: "DRV-104", capacity: 36, active: true },
  { id: "BUS-105", label: "BUS-105", routeId: "R3", driverName: "Mohit Kumar", driverId: "DRV-105", capacity: 30, active: true },
];

/** The bus the demo driver account is assigned to. */
export const DRIVER_BUS_ID = "BUS-102";

/** Mocked passenger position (Clock Tower area, Dehradun). */
export const USER_POSITION = { lat: 30.3255, lng: 78.043 };

export function getStop(id: string): Stop | undefined {
  return STOPS.find((s) => s.id === id);
}

export function getRoute(id: string): TransitRoute | undefined {
  return ROUTES.find((r) => r.id === id || r.code === id);
}

export function getBusRecord(id: string): BusRecord | undefined {
  return BUSES.find((b) => b.id === id);
}

export function routeStops(route: TransitRoute): Stop[] {
  return route.stopIds.map(getStop).filter((s): s is Stop => Boolean(s));
}

export function routePath(route: TransitRoute): [number, number][] {
  return routeStops(route).map((s) => [s.lat, s.lng]);
}
