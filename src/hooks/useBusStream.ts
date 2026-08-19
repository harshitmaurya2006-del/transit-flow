import { useCallback, useEffect, useMemo, useState } from "react";
import { transportService, type LiveBus } from "@/services/transport";

export interface BusStream {
  buses: LiveBus[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

/** Single subscription point for live bus data (mock today, Socket.IO later). */
export function useBusStream(): BusStream {
  const [buses, setBuses] = useState<LiveBus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    let unsubscribe = () => {};
    try {
      unsubscribe = transportService.subscribe((next) => {
        if (cancelled) return;
        setBuses(next);
        setLoading(false);
      });
    } catch {
      setError("Unable to load live locations.");
      setLoading(false);
    }
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return { buses, loading, error, retry };
}

export function useBus(busId: string | undefined) {
  const stream = useBusStream();
  const bus = useMemo(
    () => stream.buses.find((b) => b.id === busId) ?? null,
    [stream.buses, busId],
  );
  return { ...stream, bus };
}
