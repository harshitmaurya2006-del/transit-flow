# Graph Report - sih project  (2026-09-01)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 751 nodes · 1516 edges · 88 communities (32 shown, 52 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.86)
- Token cost: 1,901 input · 973 output

## Graph Freshness
- Built from commit: `dbe08952`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Bus Tracking Components
- Navigation UI Components
- Linting and Formatting
- Sidebar and Input UI
- TypeScript and Vite Config
- Geospatial Utilities and Mocks
- Overlay UI Components
- Application Routing
- Dialog and Calendar Components
- Server Error Handling
- Project Configuration
- Command and Dialog UI
- Menubar Components
- Frontend Dependencies
- Form UI Components
- Carousel Components
- Route Definitions
- Error Reporting and Root
- Chart Components
- Project Documentation
- Authentication Logic
- Sheet UI Components
- Table UI Components
- Drawer UI Components
- Navigation Menu UI
- Select UI Components
- Alert UI Components
- OTP Input Components
- Database Configuration
- Avatar UI Components
- Badge UI Components
- Toast Notifications
- Route Schemas
- Admin Route Management
- Platform Documentation
- Class Utility
- Command Menu Library
- Date Utilities
- Carousel Library
- Form Validation Resolvers
- OTP Input Library
- Maps Library
- Icon Library
- Database ORM
- Radix Accordion
- Radix Alert Dialog
- Radix Aspect Ratio
- Radix Avatar
- Radix Checkbox
- Radix Collapsible
- Radix Context Menu
- Radix Dialog
- Radix Dropdown Menu
- Radix Hover Card
- Radix Label
- Radix Menubar
- Radix Navigation Menu
- Radix Popover
- Radix Progress
- Radix Radio Group
- Radix Scroll Area
- Radix Select
- Radix Separator
- Radix Slider
- Radix Slot
- Radix Switch
- Radix Tabs
- Radix Toggle
- Radix Toggle Group
- React Core
- React DOM
- React Hook Form
- React Leaflet Maps
- Resizable Panel Library
- Charting Library
- Sonner Notifications
- Tailwind Vite Plugin
- TanStack React Start
- TanStack Router Plugin
- Tailwind Animations
- Leaflet Type Definitions
- Drawer Library
- Vite Path Mapping
- Schema Validation

## God Nodes (most connected - your core abstractions)
1. `cn()` - 239 edges
2. `getRoute()` - 30 edges
3. `compilerOptions` - 22 edges
4. `useBusStream()` - 18 edges
5. `FileRoutesByPath` - 17 edges
6. `Button` - 17 edges
7. `LiveBus` - 16 edges
8. `getStop()` - 16 edges
9. `formatEta()` - 15 edges
10. `ErrorState()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `SmartTransit Plan` --references--> `SmartTransit Project`  [EXTRACTED]
  .lovable/plan/smarttransit-real-time-transport-tracking-frontend-2026-08-19.md → README.md
- `SimState` --inherits--> `LiveBus`  [EXTRACTED]
  src/services/transport/mock-adapter.ts → src/services/transport/types.ts
- `AlertDescription` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert.tsx → src/lib/utils.ts
- `AlertTitle` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert.tsx → src/lib/utils.ts
- `AlertDialogContent` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **SmartTransit User Roles** — passenger_experience, driver_experience, admin_experience [EXTRACTED 1.00]

## Communities (88 total, 52 thin omitted)

### Community 0 - "Bus Tracking Components"
Cohesion: 0.06
Nodes (79): BusCard(), Column, DataTable(), ETACard(), DOT, FreshnessIndicator(), TONE, KpiCard() (+71 more)

### Community 1 - "Navigation UI Components"
Cohesion: 0.07
Nodes (43): MapSkeleton(), AccordionContent, AccordionItem, AccordionTrigger, Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink (+35 more)

### Community 2 - "Linting and Formatting"
Cohesion: 0.04
Nodes (47): eslint, eslint-config-prettier, @eslint/js, eslint-plugin-prettier, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @lovable.dev/vite-tanstack-config (+39 more)

### Community 3 - "Sidebar and Input UI"
Cohesion: 0.07
Nodes (32): Input, Separator, Sidebar, SidebarContent, SidebarContext, SidebarContextProps, SidebarFooter, SidebarGroup (+24 more)

### Community 4 - "TypeScript and Vite Config"
Cohesion: 0.06
Nodes (31): DOM, DOM.Iterable, ES2022, eslint.config.js, src/**/*.ts, src/**/*.tsx, vite/client, vite.config.ts (+23 more)

### Community 5 - "Geospatial Utilities and Mocks"
Cohesion: 0.13
Nodes (17): cumulativeDistances(), distanceM(), distanceToIndex(), LatLng, Point, pointAtProgress(), ACTIVE_ROUTE_COUNT, advance() (+9 more)

### Community 6 - "Overlay UI Components"
Cohesion: 0.09
Nodes (15): BottomSheet(), Checkbox, HoverCardContent, PopoverContent, Progress, ScrollArea, ScrollBar, Slider (+7 more)

### Community 7 - "Application Routing"
Cohesion: 0.09
Nodes (25): getRouter(), AdminAnalyticsRoute, AdminBusesRoute, AdminFleetRoute, AdminIndexRoute, AdminLoginRoute, AdminRoutesRoute, AdminStopsRoute (+17 more)

### Community 8 - "Dialog and Calendar Components"
Cohesion: 0.11
Nodes (20): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle (+12 more)

### Community 9 - "Server Error Handling"
Cohesion: 0.16
Nodes (13): consumeLastCapturedError(), describeError(), describeStatus(), originalConsoleError, safeStringify(), renderErrorPage(), fetch(), getServerEntry() (+5 more)

### Community 10 - "Project Configuration"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 11 - "Command and Dialog UI"
Cohesion: 0.12
Nodes (14): Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut() (+6 more)

### Community 12 - "Menubar Components"
Cohesion: 0.12
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 13 - "Frontend Dependencies"
Cohesion: 0.13
Nodes (15): class-variance-authority, dependencies, class-variance-authority, @radix-ui/react-tooltip, react-day-picker, tailwind-merge, tailwindcss, @tanstack/react-query (+7 more)

### Community 14 - "Form UI Components"
Cohesion: 0.19
Nodes (12): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+4 more)

### Community 15 - "Carousel Components"
Cohesion: 0.19
Nodes (13): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+5 more)

### Community 16 - "Route Definitions"
Cohesion: 0.14
Nodes (14): Route, Route, Route, Route, Route, Route, Route, Route (+6 more)

### Community 17 - "Error Reporting and Root"
Cohesion: 0.20
Nodes (7): LovableErrorOptions, LovableEvents, reportLovableError(), Window, ErrorComponent(), Route, FileRoutesById

### Community 18 - "Chart Components"
Cohesion: 0.25
Nodes (9): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartTooltipContent, getPayloadConfigFromPayload(), THEMES (+1 more)

### Community 19 - "Project Documentation"
Cohesion: 0.24
Nodes (8): Admin Experience, Driver Experience, SmartTransit Plan, Passenger Experience, Real-time Synchronization Flow, SmartTransit Project, TanStack Router, Frontend Tech Stack

### Community 20 - "Authentication Logic"
Cohesion: 0.31
Nodes (7): KEY(), Role, useMockAuth(), AdminLogin(), Route, DriverLogin(), Route

### Community 21 - "Sheet UI Components"
Cohesion: 0.25
Nodes (8): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 22 - "Table UI Components"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 23 - "Drawer UI Components"
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 24 - "Navigation Menu UI"
Cohesion: 0.29
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 25 - "Select UI Components"
Cohesion: 0.25
Nodes (7): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 26 - "Alert UI Components"
Cohesion: 0.50
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 27 - "OTP Input Components"
Cohesion: 0.40
Nodes (4): InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 28 - "Database Configuration"
Cohesion: 0.60
Nodes (3): connectToDatabase(), MongooseCache, runVerification()

### Community 29 - "Avatar UI Components"
Cohesion: 0.50
Nodes (3): Avatar, AvatarFallback, AvatarImage

### Community 30 - "Badge UI Components"
Cohesion: 0.67
Nodes (3): Badge(), BadgeProps, badgeVariants

### Community 33 - "Admin Route Management"
Cohesion: 1.00
Nodes (3): RoutesAdminPage(), move(), updateStops()

## Knowledge Gaps
- **199 isolated node(s):** `Freshness`, `SortKey`, `BusLocationUpdate`, `FormFieldContextValue`, `FormItemContextValue` (+194 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 233 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **52 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Navigation UI Components` to `Bus Tracking Components`, `Sidebar and Input UI`, `Overlay UI Components`, `Dialog and Calendar Components`, `Command and Dialog UI`, `Menubar Components`, `Form UI Components`, `Carousel Components`, `Chart Components`, `Sheet UI Components`, `Table UI Components`, `Drawer UI Components`, `Navigation Menu UI`, `Select UI Components`, `Alert UI Components`, `OTP Input Components`, `Avatar UI Components`, `Badge UI Components`?**
  _High betweenness centrality (0.307) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Frontend Dependencies` to `Linting and Formatting`, `Class Utility`, `Command Menu Library`, `Date Utilities`, `Carousel Library`, `Form Validation Resolvers`, `OTP Input Library`, `Maps Library`, `Icon Library`, `Database ORM`, `Radix Accordion`, `Radix Alert Dialog`, `Radix Aspect Ratio`, `Radix Avatar`, `Radix Checkbox`, `Radix Collapsible`, `Radix Context Menu`, `Radix Dialog`, `Radix Dropdown Menu`, `Radix Hover Card`, `Radix Label`, `Radix Menubar`, `Radix Navigation Menu`, `Radix Popover`, `Radix Progress`, `Radix Radio Group`, `Radix Scroll Area`, `Radix Select`, `Radix Separator`, `Radix Slider`, `Radix Slot`, `Radix Switch`, `Radix Tabs`, `Radix Toggle`, `Radix Toggle Group`, `React Core`, `React DOM`, `React Hook Form`, `React Leaflet Maps`, `Resizable Panel Library`, `Charting Library`, `Sonner Notifications`, `Tailwind Vite Plugin`, `TanStack React Start`, `TanStack Router Plugin`, `Tailwind Animations`, `Leaflet Type Definitions`, `Drawer Library`, `Vite Path Mapping`, `Schema Validation`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `Button` connect `Bus Tracking Components` to `Navigation UI Components`, `Sidebar and Input UI`, `Dialog and Calendar Components`, `Carousel Components`, `Authentication Logic`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `Freshness`, `SortKey`, `BusLocationUpdate` to the rest of the system?**
  _199 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Bus Tracking Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06064240970278555 - nodes in this community are weakly interconnected._
- **Should `Navigation UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.07058823529411765 - nodes in this community are weakly interconnected._
- **Should `Linting and Formatting` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._