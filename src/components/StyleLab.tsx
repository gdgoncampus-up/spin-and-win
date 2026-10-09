import { useState } from 'react';
import { SPIN_STYLES, type SpinStyleId } from '../lib/spinStyles';
import { CONFETTI_STYLES, type ConfettiStyleId } from '../lib/confetti';

interface StyleLabProps {
  spin: SpinStyleId;
  confetti: ConfettiStyleId;
  onSpinChange: (id: SpinStyleId) => void;
  onConfettiChange: (id: ConfettiStyleId) => void;
  onReplayConfetti: () => void;
}

/** Test-build panel for trying every spin and confetti style. */
export function StyleLab({ spin, confetti, onSpinChange, onConfettiChange, onReplayConfetti }: StyleLabProps) {
  const [open, setOpen] = useState(true);
  const spinStyle = SPIN_STYLES.find(s => s.id === spin);
  const confettiStyle = CONFETTI_STYLES.find(s => s.id === confetti);
  const chip = (on: boolean) => `cursor-pointer rounded-full border px-3 py-1.5 text-[13px] transition-colors ${on ? 'border-royal bg-royal text-white' : 'border-navy/20 bg-white/50 hover:bg-white/80'}`;

  return (
    <aside className="glass fixed bottom-4 left-4 z-90 w-[min(380px,calc(100vw-32px))] rounded-[20px] p-4 shadow-[0_20px_50px_rgba(11,42,102,.18)]" aria-label="Animation style picker">
      <div className="flex items-center justify-between">
        <strong className="text-sm font-semibold">Style lab</strong>
        <button type="button" className="cursor-pointer text-[13px] underline-offset-2 hover:underline" onClick={() => setOpen(o => !o)} aria-expanded={open}>
          {open ? 'Hide' : 'Show'}
        </button>
      </div>
      {open && (
        <div className="mt-3 flex flex-col gap-4">
          <section>
            <p className="mb-2 text-[11px] tracking-[.14em] uppercase opacity-70">Spin</p>
            <div className="flex flex-wrap gap-1.5">
              {SPIN_STYLES.map(s => (
                <button key={s.id} type="button" className={chip(s.id === spin)} aria-pressed={s.id === spin} onClick={() => onSpinChange(s.id)}>{s.name}</button>
              ))}
            </div>
            <p className="mt-2 text-[13px] leading-snug opacity-80">{spinStyle?.blurb}</p>
          </section>
          <section>
            <p className="mb-2 text-[11px] tracking-[.14em] uppercase opacity-70">Confetti</p>
            <div className="flex flex-wrap gap-1.5">
              {CONFETTI_STYLES.map(s => (
                <button key={s.id} type="button" className={chip(s.id === confetti)} aria-pressed={s.id === confetti} onClick={() => onConfettiChange(s.id)}>{s.name}</button>
              ))}
            </div>
            <p className="mt-2 text-[13px] leading-snug opacity-80">{confettiStyle?.blurb}</p>
            <button type="button" onClick={onReplayConfetti} className="mt-2.5 cursor-pointer text-[13px] font-semibold text-royal underline-offset-2 hover:underline">
              Replay confetti without spinning
            </button>
          </section>
        </div>
      )}
    </aside>
  );
}
