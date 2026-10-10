import { useEffect, useState } from 'react';
import type { EVENT } from '../config/event';
import { GdgLogo } from './GdgLogo';

type EventMeta = Pick<typeof EVENT, 'chapterName' | 'universityName' | 'eventName'>;

interface HeaderProps {
  event: EventMeta;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const linkClass = 'cursor-pointer rounded-md text-[15px] text-navy/90 transition-opacity hover:opacity-70';

export function Header({ event, soundEnabled, onToggleSound }: HeaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { /* Unsupported or denied fullscreen should not interrupt gameplay. */ }
  };

  const controls = (
    <>
      <button type="button" className={linkClass} onClick={onToggleSound} aria-pressed={soundEnabled}>
        {soundEnabled ? 'Sound on' : 'Sound off'}
      </button>
      <button type="button" className={linkClass} onClick={toggleFullscreen}>
        {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
      </button>
    </>
  );

  return (
    <header className="relative z-20 flex items-center justify-between gap-6 pt-8 max-[900px]:pt-5">
      <div className="flex min-w-0 items-center gap-3.5" aria-label={`${event.chapterName}, ${event.universityName}`}>
        <GdgLogo className="h-[34px] w-auto shrink-0 max-[900px]:h-6" />
        <div className="leading-tight">
          <strong className="block text-lg font-semibold max-[900px]:text-[15px]">{event.chapterName}</strong>
          <span className="block text-[13px] opacity-75 max-[900px]:text-[11px]">{event.universityName}</span>
        </div>
      </div>

      <nav className="flex items-center gap-9 max-[900px]:hidden" aria-label="Game controls">{controls}</nav>

      <span className="flex items-center gap-2.5 border border-navy/22 px-[18px] py-[11px] text-[15px] max-[900px]:hidden">
        {event.eventName}
        <svg className="size-[18px] fill-none stroke-current stroke-[2.2] [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
      </span>

      <div className="relative hidden max-[900px]:block">
        <button type="button" onClick={() => setMenuOpen(open => !open)} aria-expanded={menuOpen} aria-label="Open menu"
          className="flex size-10 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-full border border-navy/22 bg-white/40">
          <i className="block h-[1.6px] w-4 bg-navy" /><i className="block h-[1.6px] w-4 bg-navy" />
        </button>
        {menuOpen && (
          <div className="glass absolute top-12 right-0 flex w-44 flex-col items-start gap-3 rounded-2xl p-4">{controls}</div>
        )}
      </div>
    </header>
  );
}
