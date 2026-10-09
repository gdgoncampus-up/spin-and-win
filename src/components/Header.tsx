import {useEffect, useState} from 'react';
import type {EVENT} from '../config/event';

type EventMeta = Pick<typeof EVENT, 'chapterName' | 'universityName' | 'eventName'>;

interface HeaderProps {
    event: EventMeta;
    soundEnabled: boolean;
    onToggleSound: () => void
}

const controlClass = 'grid size-[42px] cursor-pointer place-items-center rounded-[13px] border border-white/[.105] bg-white/[.06] text-[#dbe4f9] transition-[background,transform] duration-200 hover:-translate-y-0.5 hover:bg-white/[.14] max-[570px]:size-9 max-[570px]:rounded-[11px] [&_svg]:size-5 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.9] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] max-[570px]:[&_svg]:size-[18px]';

export function Header({event, soundEnabled, onToggleSound}: HeaderProps) {
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
        } catch { /* Unsupported or denied fullscreen should not interrupt gameplay. */
        }
    };

    return (
        <header
            className="flex min-h-22.25 items-center justify-between gap-6 border-b border-white/7.5 max-[570px]:min-h-19 max-[570px]:gap-1.5 kiosk:h-[clamp(54px,8dvh,76px)] kiosk:min-h-0 kiosk:shrink-0 portrait-tab:h-16 portrait-tab:min-h-0 portrait-tab:shrink-0 short:h-13">
            <div className="flex min-w-0 items-center gap-3.5 max-[570px]:gap-2.25"
                 aria-label={`${event.chapterName}, ${event.universityName}`}>
                <div
                    className="grid size-11 shrink-0 rotate-[-9deg] grid-cols-2 gap-1.25 rounded-[14px] bg-white/4.5 p-1.5 max-[570px]:size-8.75 max-[570px]:gap-1 max-[570px]:p-1.25 short:size-9"
                    aria-hidden="true">
                    <i className="block rounded-sm bg-[#4285f4]"/><i className="block rounded-sm bg-[#ea4335]"/>
                    <i className="block rounded-sm bg-[#fbbc04]"/><i className="block rounded-sm bg-[#34a853]"/>
                </div>
                <div>
                    <strong
                        className="block text-sm leading-[1.3] font-[850] tracking-[.11em] max-[570px]:text-[11px]">{event.chapterName}</strong>
                    <span
                        className="mt-0.75 block text-xs tracking-wide text-[#9caac4] max-[570px]:text-[10px]">{event.universityName}</span>
                </div>
            </div>
            <div className="flex items-center gap-2.5 max-[570px]:gap-1.5">
        <span
            className="mr-2.5 whitespace-nowrap rounded-full border border-[#4285f4]/40 bg-[#4285f4]/10 px-3.25 py-2.5 text-xs font-bold tracking-[.045em] text-[#c9dcff] max-[570px]:hidden">
          <b className="mr-1 text-[13px] text-[#6ff0af]" aria-hidden="true">●</b> {event.eventName}
        </span>
                <button type="button"
                        className={`${controlClass} ${soundEnabled ? 'border-[#4285f4]/50 text-[#9cc1ff]' : ''}`}
                        onClick={onToggleSound} aria-pressed={soundEnabled}
                        aria-label={soundEnabled ? 'Turn sound off' : 'Turn sound on'}
                        title={soundEnabled ? 'Sound on (click to mute)' : 'Sound off (click to enable)'}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        {soundEnabled
                            ? <>
                                <path d="M11 5 6 9H3v6h3l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>
                            </>
                            : <path d="M11 5 6 9H3v6h3l5 4V5zM17 9l5 6m0-6-5 6"/>}
                    </svg>
                </button>
                <button type="button" className={controlClass} onClick={toggleFullscreen}
                        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} title="Toggle fullscreen">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d={isFullscreen
                            ? 'M8 3v5H3 M16 3v5h5 M3 16h5v5 M21 16h-5v5'
                            : 'M8 3H3v5 M16 3h5v5 M3 16v5h5 M21 16v5h-5'}/>
                    </svg>
                </button>
            </div>
        </header>
    );
}
