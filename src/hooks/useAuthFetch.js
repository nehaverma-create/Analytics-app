import { useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";

export function useAuthFetch() {
  const { getToken } = useAuth();

  return useCallback(
    async (url, options = {}) => {
      const token = await getToken();
      const headers = new Headers(options.headers || {});

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      if (options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      return fetch(url, { ...options, headers });
    },
    [getToken]
  );
}
