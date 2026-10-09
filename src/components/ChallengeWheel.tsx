import type { RefObject } from 'react';
import type { Category } from '../types';
import { polarPoint } from '../lib/wheelMath';
import { Glyph } from './Glyph';

interface ChallengeWheelProps {
  categories: readonly Category[];
  rotatorRef: RefObject<SVGGElement | null>;
  spinning: boolean;
  onSpin: () => void;
}

/** SVG geometry is calculated in TypeScript and remains independent of Tailwind. */
function segmentPath(index: number, count: number): string {
  const slice = 360 / count;
  const center = index * slice;
  const radius = 260;
  const [sx, sy] = polarPoint(center - slice / 2, radius);
  const [ex, ey] = polarPoint(center + slice / 2, radius);
  return `M300 300 L${sx.toFixed(3)} ${sy.toFixed(3)} A${radius} ${radius} 0 0 1 ${ex.toFixed(3)} ${ey.toFixed(3)} Z`;
}

export function ChallengeWheel({ categories, rotatorRef, spinning, onSpin }: ChallengeWheelProps) {
  return (
    <div className="flex min-w-0 items-center justify-center kiosk:h-full kiosk:min-h-0 kiosk:[container-type:size] portrait-tab:h-full portrait-tab:min-h-0 portrait-tab:[container-type:size]">
      <div className="wheel-glow relative isolate aspect-square w-[min(100%,585px)] max-[900px]:w-[min(100%,520px)] kiosk:w-[min(100%,100cqh,585px)] portrait-tab:w-[min(100%,100cqh,500px)]">
        <svg className="block size-full overflow-visible drop-shadow-[0_23px_28px_rgba(0,0,0,.35)]" viewBox="0 0 600 600" role="img"
          aria-label={`${categories.length}-part challenge wheel; the white pointer at the top indicates the winning category`}>
          <circle cx="300" cy="300" r="278" fill="#16233a" stroke="rgba(255,255,255,.85)" strokeWidth="4" />
          <g className="wheel-rotator" ref={rotatorRef}>
            {categories.map((cat, index) => {
              const center = index * 360 / categories.length;
              const [cx, cy] = polarPoint(center, 174);
              const [dx, dy] = polarPoint(center, 247);
              return (
                <g key={cat.id}>
                  <path d={segmentPath(index, categories.length)} fill={cat.color}
                    stroke="rgba(255,255,255,.55)" strokeWidth="3.5" strokeLinejoin="round" />
                  <g transform={`translate(${cx.toFixed(3)} ${(cy - 33).toFixed(3)})`}
                    stroke={cat.ink} fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle r="22" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.30)" strokeWidth="1" />
                    <g transform="translate(-12 -12)"><Glyph name={cat.icon} /></g>
                  </g>
                  {cat.lines.map((line, lineIndex) => (
                    <text key={lineIndex} x={cx} y={cy + 10 + lineIndex * 22}
                      fill={cat.ink} textAnchor="middle" fontFamily="Inter,ui-sans-serif,system-ui,sans-serif"
                      fontSize={line.length > 8 ? 17 : 19} fontWeight="850" letterSpacing=".5"
                      paintOrder="stroke" stroke="rgba(0,0,0,.07)" strokeWidth="1">
                      {line}
                    </text>
                  ))}
                  <circle cx={dx} cy={dy} r="3.5" fill={cat.ink} opacity=".75" />
                </g>
              );
            })}
            <circle cx="300" cy="300" r="261" fill="none" stroke="rgba(255,255,255,.65)" strokeWidth="3" pointerEvents="none" />
          </g>
          <circle cx="300" cy="300" r="267" fill="none" stroke="rgba(255,255,255,.48)" strokeWidth="2" pointerEvents="none" />
        </svg>
        <span className="wheel-pointer pointer-events-none absolute top-[3.6%] left-1/2 z-5 h-[61px] w-[55px] -translate-x-1/2 drop-shadow-[0_6px_8px_rgba(0,0,0,.36)]" aria-hidden="true" />
        <button className="hub-button absolute top-1/2 left-1/2 z-4 flex aspect-square w-[21%] -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center gap-px rounded-full border-[7px] border-[#f1f6ff]/95 text-white transition-[filter,box-shadow] duration-200 hover:brightness-125 disabled:cursor-wait max-[570px]:border-[5px]" type="button"
          aria-label="Spin challenge wheel" onClick={onSpin} disabled={spinning}>
          <strong className="text-[clamp(13px,2.05vw,24px)] font-black tracking-[-.01em]">SPIN</strong>
          <small className="text-[clamp(8px,.9vw,10px)] font-extrabold tracking-[.1em] text-[#a4bdf1] uppercase">tap here</small>
        </button>
      </div>
    </div>
  );
}
