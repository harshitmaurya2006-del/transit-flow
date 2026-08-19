# SmartTransit — Real-Time Transport Tracking Frontend

A map-centric prototype with three experiences (Passenger, Driver, Admin) sharing one simulated real-time bus stream, so the demo flow "driver starts trip → bus moves on passenger map → admin fleet updates → ETA/delay changes" works end to end without a backend.

One stack note: this project runs on TanStack Router (file-based routing), not React Router. React Router cannot be installed here. Everything else in the brief — Leaflet/React-Leaflet + OpenStreetMap, Tailwind, Lucide, a Socket.IO-shaped service layer — is built exactly as specified, and all the routes below keep their exact URLs.

## Design system

- Light theme, Inter, deep indigo primary on light neutral background, white surfaces.
- Semantic tokens in `src/styles.css`: primary, background, surface, muted, success, warning, danger.
- Status is always color + icon + text (On Time / Delayed 8 min / Offline) via a single `StatusBadge`.
- 8px spacing scale, 12–16px card radius, subtle borders, transitions 150–300ms.

## Routes

| URL | Screen |
| --- | --- |
| `/` | Passenger home: greeting, search, nearby buses, nearby stops |
| `/map` | Live map + bus bottom sheet |
| `/bus/:id` | Bus detail: big ETA, next stop, route progress |
| `/route/:id` | Route detail: stops timeline, active buses |
| `/stops` | Nearby stops + approaching buses |
| `/driver/login`, `/driver` | Driver login, trip dashboard |
| `/admin/login`, `/admin` | Admin login, KPI dashboard + fleet map |
| `/admin/fleet` | Live fleet map + table |
| `/admin/buses`, `/admin/routes`, `/admin/stops` | Management tables/editors |
| `/admin/analytics` | Simple KPIs + charts |

Layouts: passenger (bottom nav on mobile, top nav on desktop), driver (bare), admin (persistent sidebar).

## Passenger

Home answers "what bus, when" immediately: search across buses/routes/stops with grouped results, nearby bus cards (route, origin → destination, arriving in X, status), nearby stop cards (distance, buses approaching, next bus).

Live map: full-height Leaflet/OSM map with bus markers, stop markers, route polylines, optional user location; tapping a bus opens a bottom sheet with route, ETA, next stop, and freshness ("Live · 4s ago"). Selected marker is emphasized; markers interpolate smoothly between position updates.

Bus and route detail pages use a shared vertical stop-progress timeline with filled/hollow nodes.

## Driver

Login (Driver ID + password, mock auth in local state). Dashboard has two states: pre-trip (bus, route, GPS ready, next stop, large START TRIP) and active (TRIP ACTIVE, GPS signal, current location, speed, next stop, ETA, END TRIP). Starting a trip flips that bus to live in the shared store, which is what drives the passenger and admin views.

## Admin

Dashboard: KPI cards (active / delayed / offline / active routes), live fleet map, recent bus status list, delay summary. Fleet page: map + sortable table (bus, route, driver, status, ETA) with click-through to bus detail. Buses/Stops use a reusable `DataTable` with add/edit/disable dialogs; Routes use a stop list with add/remove/reorder. Analytics: average delay, most delayed route, active buses, utilization, average journey time, with two simple charts.

## Real-time layer

- `src/data/` holds mock buses (BUS-101…105), routes (R1–R3), stops (Rajpur Road, Clock Tower, Gandhi Road, Railway Station, ISBT + more), and coordinate paths per route.
- `src/services/transport/` exposes one interface (`subscribeToBusUpdates`, `getBuses`, `startTrip`, `endTrip`, …). A mock adapter ticks buses along their polylines every ~3s emitting `{ busId, latitude, longitude, speed, timestamp, eta, status }`; a stub socket adapter with the same interface is left ready so swapping to Socket.IO is a one-line change.
- A `useBusStream` hook feeds every consumer from that single stream — no page reloads, no duplicated timers. Freshness is derived from timestamp age (live / stale / offline).
- Buses are given deliberate delay behaviour so the demo shows a status flipping to Delayed.

## Components

`StatusBadge`, `BusCard`, `RouteCard`, `StopCard`, `ETACard`, `KpiCard`, `StopTimeline`, `Map`, `BusMarker`, `StopMarker`, `RouteLine`, `BottomSheet`, `DataTable`, `SearchBar`, `EmptyState`, `ErrorState`, skeleton loaders. No page renders blank: skeletons while loading, friendly retry on error, actionable empty states — no raw technical errors.

## Technical notes

- Leaflet is browser-only, so map components load client-side after hydration to avoid SSR errors.
- Each route defines its own `head()` title/description.
- Accessibility: semantic HTML, labelled map controls and buttons, visible focus rings, 44px touch targets, contrast-checked tokens.
- No backend, no auth persistence, no ML — auth screens are UI only.

## Build order

Design system → layouts/routes → passenger home → live map → bus detail → driver dashboard → simulated movement → admin dashboard → fleet → management screens → analytics → auth UI → states → responsive polish.
