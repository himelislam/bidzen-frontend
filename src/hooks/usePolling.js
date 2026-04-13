import { useEffect, useRef } from "react";

export function usePolling(callback, intervalMs, active = true) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!active) return;
    const tick = () => savedCallback.current();
    tick(); // run immediately on mount
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, active]);
}
