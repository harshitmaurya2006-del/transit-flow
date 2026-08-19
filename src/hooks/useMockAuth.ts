import { useCallback, useEffect, useState } from "react";

export type Role = "driver" | "admin";

const KEY = (role: Role) => `smarttransit.${role}`;

/** UI-only mock auth. Replace with real Express session/JWT handling later. */
export function useMockAuth(role: Role) {
  const [user, setUser] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(window.localStorage.getItem(KEY(role)));
    setReady(true);
  }, [role]);

  const login = useCallback(
    (identifier: string) => {
      window.localStorage.setItem(KEY(role), identifier);
      setUser(identifier);
    },
    [role],
  );

  const logout = useCallback(() => {
    window.localStorage.removeItem(KEY(role));
    setUser(null);
  }, [role]);

  return { user, ready, login, logout };
}
