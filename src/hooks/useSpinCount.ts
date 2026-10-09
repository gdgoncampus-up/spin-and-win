import { useCallback, useState } from 'react';

const KEY = 'gdg-wheel-spins';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function read(): number {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null') as { day?: string; count?: number } | null;
    return saved?.day === today() && typeof saved.count === 'number' ? saved.count : 0;
  } catch {
    return 0;
  }
}

/** Counts today's spins on this device (the booth kiosk), surviving reloads. */
export function useSpinCount() {
  const [count, setCount] = useState(read);
  const increment = useCallback(() => {
    const next = read() + 1;
    try { localStorage.setItem(KEY, JSON.stringify({ day: today(), count: next })); } catch { /* storage blocked */ }
    setCount(next);
  }, []);
  return { count, increment };
}
