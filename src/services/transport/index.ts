import { mockTransportService } from "./mock-adapter";
import type { TransportService } from "./types";

/**
 * Single place the whole app gets live transport data from.
 * Swap this for `createSocketTransportService(import.meta.env.VITE_SOCKET_URL)`
 * once the Express + Socket.IO backend is live — no UI changes required.
 */
export const transportService: TransportService = mockTransportService;

export * from "./types";
