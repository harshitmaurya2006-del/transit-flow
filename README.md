# Transit Flow

Build the frontend for a hackathon project called "SmartTransit" — a Real-Time Public Transport Tracking & Intelligence Platform.

IMPORTANT:

This is an SIH-level prototype being built by a beginner/intermediate student team. Keep the frontend technically clean, modular, realistic, and easy to connect to an Express + Socket.IO backend later. Do NOT over-engineer the frontend or add unnecessary features.

TECH STACK:

- React

- React Router

- Tailwind CSS

- Leaflet + React-Leaflet

- OpenStreetMap

- Socket.IO client architecture

- Lucide React icons

- Use mock/local data initially where backend data is unavailable.

- Structure the code so APIs and Socket.IO can easily replace mock data later.

PRODUCT PURPOSE:

The platform connects:

Driver GPS → Backend → Real-time Socket.IO → Passenger App + Admin Dashboard

The main objective is to allow passengers to:

- Find buses

- See live bus locations

- See routes and stops

- See estimated arrival time (ETA)

- See delay/on-time status

Drivers should be able to:

- Login

- Select assigned bus

- Start a trip

- Transmit GPS

- See current trip and next stop

- End trip

Admins should be able to:

- Monitor the entire fleet

- See live buses on a map

- Manage buses

- Manage routes

- Manage stops

- View delays

- View basic analytics

CORE DEMO FLOW:

Driver starts trip

→ GPS becomes active

→ location is sent to backend

→ Socket.IO broadcasts location

→ passenger sees bus moving on map

→ admin sees same bus moving

→ ETA changes

→ delay status updates

This real-time synchronization is the main SIH "wow" moment.

==================================================

DESIGN PHILOSOPHY

==================================================

The product is a transport utility, NOT a marketing website.

Design should feel like:

- Modern mobility technology

- Trustworthy public infrastructure

- Clean SaaS dashboard

- Map-centric

- Fast

- Professional

- Simple enough for first-time public transport users

Prioritize:

1. Real-time information

2. ETA visibility

3. Map clarity

4. Simple navigation

5. Trust/freshness of information

6. Mobile responsiveness

7. Accessibility

Avoid:

- Excessive glassmorphism

- Neon/cyberpunk design

- Huge hero sections

- Excessive gradients

- Excessive shadows

- Decorative animations

- Fake AI features

- Unnecessary pages

- Overcomplicated dashboards

==================================================

VISUAL SYSTEM

==================================================

Use a clean light theme by default.

Color direction:

- Primary: Deep Blue / Indigo

- Background: Light neutral

- Surface: White

- Text: Dark

- Muted: Gray

- Success: Green

- Warning: Amber

- Danger: Red

Transport status must ALWAYS use:

Color + Icon + Text

Examples:

🟢 On Time

🟠 Delayed 8 min

🔴 Offline

Never communicate important status using color alone.

Typography:

- Use Inter

- Clear hierarchy

- Strong readable headings

- Highly readable body text

Spacing:

Use an 8px spacing system:

8 / 16 / 24 / 32 / 48px

Cards:

- 12–16px radius

- Subtle border/shadow

- Clean spacing

Buttons:

- 10–12px radius

- Clear primary/secondary hierarchy

- Large enough touch targets

==================================================

APPLICATION STRUCTURE

==================================================

There are 3 main experiences:

1. Passenger

2. Driver

3. Admin

Use React Router for navigation.

Suggested routes:

/                         → Passenger Home

/map                      → Live Map

/bus/:id                  → Bus Details

/route/:id                → Route Details

/stops                    → Nearby Stops

/driver/login             → Driver Login

/driver                   → Driver Dashboard

/admin/login              → Admin Login

/admin                    → Admin Dashboard

/admin/fleet              → Live Fleet

/admin/buses              → Bus Management

/admin/routes             → Route Management

/admin/stops              → Stop Management

/admin/analytics          → Analytics

Use reusable layouts instead of duplicating navigation.

==================================================

PASSENGER EXPERIENCE

==================================================

Passenger is MOBILE-FIRST.

Bottom navigation:

Home | Map | Routes | Stops

-------------------------

PASSENGER HOME

-------------------------

The home screen should immediately answer:

"What bus can I take and when will it arrive?"

Structure:

Good Morning

Where are you going?

[ Search buses, routes or stops ]

Nearby Buses

Bus Card:

🚌 Route 102

Rajpur Road → ISBT

Arriving in 6 min

🟢 On Time

Nearby Stops

Stop Card:

📍 Rajpur Road

250 m

2 buses approaching

Next bus: 6 min

Search should support:

- Bus number

- Route number

- Stop name

- Destination

Search result categories:

Routes

Stops

Buses

-------------------------

LIVE MAP

-------------------------

This is the core passenger screen.

Layout:

Top:

[ Search ]

Center:

Large interactive map

Map:

- Bus markers

- Stop markers

- Route lines

- User location if permission is available

Bottom:

Selected bus information sheet

Example:

🚌 Route 102

Rajpur Road → ISBT

6 min

Next Stop: Clock Tower

🟢 Live · 4 sec ago

Use a bottom sheet on mobile.

Bus markers should be simple and clear.

Selected bus marker should be visually emphasized.

Bus movement should be smooth when real-time data updates.

-------------------------

BUS DETAILS

-------------------------

Show:

Bus number

Route

Current location

ETA

Next stop

Status

Route progress

Example:

🚌 Route 102

Rajpur Road → ISBT

6 min

Next Stop

Clock Tower

🟢 On Time

Route Progress:

● Rajpur Road

│

● Clock Tower

│

● Gandhi Road

│

○ Railway Station

│

○ ISBT

ETA should be the most visually prominent information.

-------------------------

ROUTE DETAILS

-------------------------

Show:

Route 102

Rajpur Road → ISBT

4 buses active

Estimated journey:

32 min

Stops:

● Rajpur Road

│

● Clock Tower

│

● Gandhi Road

│

● Railway Station

│

● ISBT

Also show active buses currently using this route.

-------------------------

NEARBY STOPS

-------------------------

Show stop cards:

📍 Rajpur Road

250 m

2 buses approaching

Next bus: 6 min

📍 Clock Tower

700 m

1 bus approaching

Next bus: 9 min

Allow users to select a stop and see approaching buses.

==================================================

DRIVER EXPERIENCE

==================================================

Driver UI must be extremely simple because drivers should interact minimally while operating a bus.

-------------------------

DRIVER LOGIN

-------------------------

Simple centered login:

SMARTTRANSIT

Driver ID / Phone

[____________]

Password

[____________]

[ Login ]

-------------------------

DRIVER DASHBOARD

-------------------------

Before trip:

BUS-102

Route:

Rajpur Road → ISBT

GPS

🟢 Ready

Next Stop:

Clock Tower

[ START TRIP ]

After starting:

🟢 TRIP ACTIVE

GPS Signal

Strong

Current Location

Rajpur Road

Speed

28 km/h

Next Stop

Clock Tower

ETA

6 min

[ END TRIP ]

The driver screen should not contain unnecessary navigation or analytics.

==================================================

ADMIN EXPERIENCE

==================================================

Admin is DESKTOP-FIRST.

Use persistent sidebar.

Sidebar:

Dashboard

Live Fleet

Buses

Routes

Stops

Drivers

Analytics

Settings

Main dashboard should be information-dense but clean.

-------------------------

ADMIN DASHBOARD

-------------------------

Top KPI cards:

ACTIVE BUSES

24

DELAYED

5

OFFLINE

2

ACTIVE ROUTES

12

Then:

LIVE FLEET MAP

Below/alongside:

Recent Bus Status

BUS-102    🟢 On Time    6 min

BUS-104    🟠 Delayed    11 min

BUS-109    🔴 Offline

Also show a small delay summary.

-------------------------

LIVE FLEET

-------------------------

Large live map.

Show all active buses.

Below/alongside map show:

Bus

Route

Driver

Status

ETA

Example:

BUS-102

R1

Rahul

🟢 On Time

6 min

BUS-104

R2

Aman

🟠 Delayed

11 min

BUS-109

R3

Ravi

🔴 Offline

Admin should be able to click a bus and see details.

-------------------------

BUS MANAGEMENT

-------------------------

Use a clean data table:

Bus | Route | Driver | Status | Actions

Actions:

View

Edit

Assign

Disable

Provide Add Bus button.

-------------------------

ROUTE MANAGEMENT

-------------------------

Show routes with stops.

Example:

Route R1

● Rajpur Road

│

● Clock Tower

│

● Gandhi Road

│

● Railway Station

│

● ISBT

Admin can:

- Create route

- Edit route

- Add stop

- Remove stop

- Reorder stops

- Deactivate route

-------------------------

STOP MANAGEMENT

-------------------------

Table/list of:

- Stop name

- Location

- Routes

- Status

Allow add/edit/deactivate.

-------------------------

ANALYTICS

-------------------------

Keep analytics simple.

Show:

- Average delay

- Most delayed route

- Active buses

- Bus utilization

- Average journey time

Use clean charts and KPI cards.

Do not create a complicated BI dashboard.

==================================================

REAL-TIME UX

==================================================

Real-time tracking is the most important functionality.

Architecture:

Driver GPS

→ Express Backend

→ Socket.IO

→ React Passenger/Admin

→ Map marker update

Design the frontend with a service abstraction so Socket.IO can later replace mock data.

Example conceptual event:

bus:location_updated

Data:

{

  busId,

  latitude,

  longitude,

  speed,

  timestamp,

  eta,

  status

}

When receiving location updates:

- Update bus marker

- Smoothly move marker

- Update ETA

- Update status

- Update admin fleet

- Do NOT reload page

Show freshness:

🟢 Live · 4 sec ago

🟠 Stale · 40 sec ago

🔴 Offline

If location becomes stale, clearly communicate that information may not be current.

==================================================

MOCK DATA

==================================================

Initially create realistic mock data for:

Buses:

BUS-101

BUS-102

BUS-103

BUS-104

BUS-105

Routes:

R1

R2

R3

Stops:

Rajpur Road

Clock Tower

Gandhi Road

Railway Station

ISBT

and additional realistic stops.

Create mock bus coordinates along route paths.

For the prototype, simulate buses moving between coordinates every few seconds.

This should demonstrate:

Bus moves

→ map marker moves

→ ETA changes

→ admin updates

Keep mock data in a separate data/service layer so it can easily be replaced with backend APIs.

==================================================

REACT ARCHITECTURE

==================================================

Use reusable components.

Suggested structure:

src/

├── components/

│   ├── BusCard

│   ├── RouteCard

│   ├── StopCard

│   ├── ETACard

│   ├── StatusBadge

│   ├── Map

│   ├── BusMarker

│   ├── StopMarker

│   ├── RouteLine

│   ├── BottomSheet

│   ├── DataTable

│   ├── KpiCard

│   ├── Navbar

│   ├── Sidebar

│   └── ...

│

├── pages/

│   ├── passenger/

│   ├── driver/

│   └── admin/

│

├── layouts/

├── services/

├── hooks/

├── data/

├── utils/

└── routes/

Avoid duplicate components.

Create reusable UI primitives and consistent design tokens.

==================================================

LOADING / ERROR / EMPTY STATES

==================================================

Never show blank screens.

Loading:

Loading live transport data...

Use skeletons where appropriate.

Error:

Unable to load live locations.

[ Try Again ]

Empty:

No buses nearby.

[ View All Routes ]

Show useful user-friendly messages.

Never expose technical errors such as:

SocketConnectionError

500 Internal Server Error

etc.

==================================================

RESPONSIVE DESIGN

==================================================

Mobile:

- Bottom navigation

- Full-screen map

- Bottom sheets

- Large touch targets

Tablet:

- Map + information panel

Desktop Passenger:

- Sidebar or top navigation

- Large map

- Information panel

Desktop Admin:

- Persistent sidebar

- Dashboard

- Map

- Tables

- Analytics

The UI must be responsive from mobile to desktop.

==================================================

ACCESSIBILITY

==================================================

Ensure:

- Good contrast

- Keyboard navigation

- Visible focus states

- Readable text

- Large touch targets

- Semantic HTML

- Status communicated using icon + text

- Accessible labels for map controls and buttons

==================================================

ANIMATION

==================================================

Use subtle motion only.

Good:

- Bus marker movement

- ETA updates

- Bottom sheet transitions

- Status changes

- Loading transitions

Keep most transitions around 150–300ms.

Do NOT use decorative animations.

==================================================

IMPORTANT DEVELOPMENT RULES

==================================================

1. Build the core real-time transport experience first.

2. Do not build unnecessary pages.

3. Do not introduce ML into the frontend.

4. Do not create fake AI features just for appearance.

5. Keep components reusable.

6. Keep mock data separate from UI.

7. Prepare services for future Express APIs.

8. Prepare Socket.IO integration architecture.

9. Keep UI lightweight and performant.

10. Do not expose secrets in frontend code.

11. Do not directly couple UI components to database logic.

12. Use realistic transport data.

13. Prioritize functionality over visual complexity.

14. Maintain a consistent design system throughout the application.

==================================================

BUILD PRIORITY

==================================================

Build in this exact order:

1. Global design system

2. React routing/layouts

3. Passenger Home

4. Live Map

5. Bus Details

6. Driver Dashboard

7. Simulated real-time bus movement

8. Admin Dashboard

9. Live Fleet

10. Bus Management

11. Route/Stop Management

12. Analytics

13. Authentication UI

14. Loading/error/empty states

15. Responsive polish

==================================================

MOST IMPORTANT SIH DEMONSTRATION

==================================================

The final frontend must make this flow visually obvious:

DRIVER

→ Start Trip

GPS

→ Location changes

BACKEND

→ Receives location

SOCKET.IO

→ Broadcasts update

PASSENGER

→ Bus moves on map

ADMIN

→ Same bus moves on fleet map

ETA

→ Changes dynamically

DELAY

→ Status changes to 🟠 Delayed

The UI should make this real-time synchronization the central "wow" moment.

FINAL PRINCIPLE:

Build a clean, professional, map-centric React application that makes public transport tracking extremely easy to understand.

The three core questions are:

Passenger:

"Where is my bus?"

"When will it arrive?"

"Can I trust this information?"

Driver:

"Is GPS active?"

"What is my next stop?"

Admin:

"Where are my buses?"

"Which buses are delayed?"

"What is happening across the network?"

Do not optimize for the number of screens.

Optimize for clarity, real-time visibility, reliability, and a strong SIH demonstration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e19574f8-f257-4d4c-801a-8e631a89e0b7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
