import { useCallback, useEffect, useRef, useState } from 'react';

export function useSound() {
  const [enabled, setEnabled] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    try {
      if (contextRef.current?.state === 'closed') contextRef.current = null;
      contextRef.current ??= new AudioContext();
      if (contextRef.current.state === 'suspended') void contextRef.current.resume();
      return contextRef.current;
    } catch {
      return null; // Sound unavailable must not affect the game.
    }
  }, []);

  const toggle = useCallback(() => {
    if (!enabled) {
      if (getContext()) setEnabled(true);
    } else setEnabled(false);
  }, [enabled, getContext]);

  const playWinSound = useCallback(() => {
    if (!enabled) return;
    const ctx = getContext();
    if (!ctx) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((frequency, i) => {
      const oscillator = ctx.createOscillator();
      const envelope = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      const start = ctx.currentTime + i * 0.105;
      envelope.gain.setValueAtTime(0.0001, start);
      envelope.gain.exponentialRampToValueAtTime(0.065, start + 0.018);
      envelope.gain.exponentialRampToValueAtTime(0.0001, start + 0.42);
      oscillator.connect(envelope);
      envelope.connect(ctx.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.44);
    });
  }, [enabled, getContext]);

  useEffect(() => () => { void contextRef.current?.close(); }, []);
  return { enabled, toggle, playWinSound };
}
