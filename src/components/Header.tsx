import { useEffect, useState } from 'react';

interface HeaderProps { soundEnabled: boolean; onToggleSound: () => void }

export function Header({ soundEnabled, onToggleSound }: HeaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  return (
    <header className="topbar">
      <div className="brand" aria-label="GDG on Campus, University of Primorska">
        <div className="brandmark" aria-hidden="true"><i/><i/><i/><i/></div>
        <div><strong>GDG ON CAMPUS</strong><span>University of Primorska</span></div>
      </div>
      <div className="right-tools">
        <span className="event-tag"><b aria-hidden="true">●</b> ŠtartUP 2026</span>
        <button type="button" className="icon-button" onClick={onToggleSound}
          aria-pressed={soundEnabled} aria-label={soundEnabled ? 'Turn sound off' : 'Turn sound on'}
          title={soundEnabled ? 'Sound on (click to mute)' : 'Sound off (click to enable)'}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {soundEnabled
              ? <><path d="M11 5 6 9H3v6h3l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></>
              : <path d="M11 5 6 9H3v6h3l5 4V5zM17 9l5 6m0-6-5 6"/>}
          </svg>
        </button>
        <button type="button" className="icon-button" onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} title="Toggle fullscreen">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={isFullscreen
              ? 'M8 3v4a1 1 0 0 1-1 1H3m13-5v4a1 1 0 0 0 1 1h4M3 16h4a1 1 0 0 1 1 1v4m13-5h-4a1 1 0 0 0-1 1v4'
              : 'M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3'} />
          </svg>
        </button>
      </div>
    </header>
  );
}
