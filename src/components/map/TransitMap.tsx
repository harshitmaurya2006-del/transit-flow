import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { STOPS, USER_POSITION, getRoute, routePath, type Stop, type TransitRoute } from "@/data/transit";
import type { LiveBus } from "@/services/transport";

export interface TransitMapProps {
  buses: LiveBus[];
  routes?: TransitRoute[];
  stops?: Stop[];
  selectedBusId?: string | null;
  onSelectBus?: (busId: string) => void;
  center?: [number, number];
  zoom?: number;
  showUser?: boolean;
  fitToContent?: boolean;
}

const STATUS_COLOR: Record<LiveBus["status"], string> = {
  on_time: "var(--success)",
  delayed: "var(--warning)",
  offline: "var(--danger)",
};

function busIcon(bus: LiveBus, selected: boolean) {
  const color = STATUS_COLOR[bus.status];
  const size = selected ? 40 : 32;
  return L.divIcon({
    className: "st-bus-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="
        width:${size}px;height:${size}px;border-radius:9999px;
        display:flex;align-items:center;justify-content:center;
        background:${color};color:#fff;font-size:${selected ? 12 : 10}px;font-weight:700;
        border:${selected ? 3 : 2}px solid #fff;
        box-shadow:0 1px 6px rgba(0,0,0,.3);
      ">${bus.label.replace("BUS-", "")}</div>`,
  });
}

function stopIcon() {
  return L.divIcon({
    className: "st-stop-marker",
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    html: `<div style="width:12px;height:12px;border-radius:9999px;background:#fff;border:3px solid var(--primary);"></div>`,
  });
}

function userIcon() {
  return L.divIcon({
    className: "st-user-marker",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    html: `<div style="width:16px;height:16px;border-radius:9999px;background:var(--primary);border:3px solid #fff;box-shadow:0 0 0 4px color-mix(in oklab, var(--primary) 25%, transparent);"></div>`,
  });
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) return;
    map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points.length]);
  return null;
}

export default function TransitMap({
  buses,
  routes = [],
  stops = STOPS,
  selectedBusId,
  onSelectBus,
  center = [USER_POSITION.lat, USER_POSITION.lng],
  zoom = 13,
  showUser = false,
  fitToContent = false,
}: TransitMapProps) {
  const lines = routes.map((r) => ({ id: r.id, path: routePath(r) }));
  const fitPoints: [number, number][] = fitToContent
    ? [...lines.flatMap((l) => l.path), ...buses.map((b) => [b.latitude, b.longitude] as [number, number])]
    : [];

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className="size-full"
      style={{ minHeight: 240 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {fitToContent ? <FitBounds points={fitPoints} /> : null}

      {lines.map((line) => (
        <Polyline
          key={line.id}
          positions={line.path}
          pathOptions={{ color: "var(--primary)", weight: 4, opacity: 0.6 }}
        />
      ))}

      {stops.map((stop) => (
        <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={stopIcon()}>
          <Tooltip direction="top">{stop.name}</Tooltip>
        </Marker>
      ))}

      {showUser ? <Marker position={[USER_POSITION.lat, USER_POSITION.lng]} icon={userIcon()} /> : null}

      {buses.map((bus) => {
        const route = getRoute(bus.routeId);
        return (
          <Marker
            key={bus.id}
            position={[bus.latitude, bus.longitude]}
            icon={busIcon(bus, bus.id === selectedBusId)}
            eventHandlers={{ click: () => onSelectBus?.(bus.id) }}
            zIndexOffset={bus.id === selectedBusId ? 1000 : 0}
          >
            <Tooltip direction="top">
              {bus.label} · {route?.name ?? bus.routeId}
            </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
