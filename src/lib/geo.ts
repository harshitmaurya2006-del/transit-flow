export type LatLng = { lat: number; lng: number };
export type Point = [number, number];

/** Great-circle distance in metres. */
export function distanceM(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Cumulative distances along a polyline (metres). */
export function cumulativeDistances(path: Point[]): number[] {
  const out: number[] = [0];
  for (let i = 1; i < path.length; i++) {
    const prev = path[i - 1]!;
    const curr = path[i]!;
    out.push(
      out[i - 1]! + distanceM({ lat: prev[0], lng: prev[1] }, { lat: curr[0], lng: curr[1] }),
    );
  }
  return out;
}

/** Position at `progress` (0..1) along a polyline, plus the index of the next vertex. */
export function pointAtProgress(
  path: Point[],
  progress: number,
): { lat: number; lng: number; nextIndex: number } {
  const fallback = path[path.length - 1] ?? [0, 0];
  if (path.length < 2) {
    return { lat: fallback[0], lng: fallback[1], nextIndex: 0 };
  }
  const cum = cumulativeDistances(path);
  const total = cum[cum.length - 1] || 1;
  const target = Math.min(Math.max(progress, 0), 1) * total;
  for (let i = 1; i < cum.length; i++) {
    if (target <= cum[i]!) {
      const prev = path[i - 1]!;
      const curr = path[i]!;
      const segLen = cum[i]! - cum[i - 1]! || 1;
      const t = (target - cum[i - 1]!) / segLen;
      return {
        lat: prev[0] + (curr[0] - prev[0]) * t,
        lng: prev[1] + (curr[1] - prev[1]) * t,
        nextIndex: i,
      };
    }
  }
  return { lat: fallback[0], lng: fallback[1], nextIndex: path.length - 1 };
}

/** Remaining distance (metres) from `progress` to the vertex at `index`. */
export function distanceToIndex(path: Point[], progress: number, index: number): number {
  const cum = cumulativeDistances(path);
  const total = cum[cum.length - 1] || 1;
  return Math.max(0, (cum[index] ?? total) - progress * total);
}

export function formatDistance(metres: number): string {
  return metres < 1000 ? `${Math.round(metres / 10) * 10} m` : `${(metres / 1000).toFixed(1)} km`;
}
