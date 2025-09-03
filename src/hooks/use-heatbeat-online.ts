import { useEffect, useState, useRef } from "react";

export function useHeartbeat(url: string, intervalMs: number = 5000) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

        const response = await fetch(url, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        setIsOnline(response.ok);
      } catch {
        setIsOnline(false);
      }
    };

    // Run immediately on mount
    checkConnection();

    // Run periodically
    intervalRef.current = setInterval(checkConnection, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [url, intervalMs]);

  return isOnline;
}
