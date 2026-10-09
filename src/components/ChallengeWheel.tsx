import type { RefObject } from 'react';
import type { Category } from '../types';
import { normalizeAngle, polarPoint } from '../lib/wheelMath';
import { PEG_RADIUS } from '../lib/ticker';
import { GdgLogo } from './GdgLogo';

interface ChallengeWheelProps {
  categories: readonly Category[];
  rotatorRef: RefObject<SVGGElement | null>;
  flapperRef: RefObject<SVGGElement | null>;
  spinning: boolean;
  /** Segment drawn in solid blue: the one resting under the flapper. */
  highlightIndex: number | null;
  /** Current rest rotation, so labels can be flipped to read upright where they stopped. */
  restAngle: number;
  onSpin: () => void;
}

const OUTER = 290;
const INNER = 88;
/** The flapper hangs from a pivot above the rim; its tip reaches into the peg ring. */
const PIVOT_Y = -44;

/** One ring segment between INNER and OUTER, centred on the slice's angle. */
function segmentPath(index: number, count: number): string {
  const slice = 360 / count;
  const center = index * slice;
  const f = (n: number) => n.toFixed(3);
  const [ox0, oy0] = polarPoint(center - slice / 2, OUTER);
  const [ox1, oy1] = polarPoint(center + slice / 2, OUTER);
  const [ix1, iy1] = polarPoint(center + slice / 2, INNER);
  const [ix0, iy0] = polarPoint(center - slice / 2, INNER);
  return `M${f(ix0)} ${f(iy0)} L${f(ox0)} ${f(oy0)} A${OUTER} ${OUTER} 0 0 1 ${f(ox1)} ${f(oy1)}`
    + ` L${f(ix1)} ${f(iy1)} A${INNER} ${INNER} 0 0 0 ${f(ix0)} ${f(iy0)} Z`;
}

/** Labels run across the segment; any that would rest in the lower half are flipped to read upright. */
function labelRotation(angle: number, restAngle: number): number {
  const onScreen = normalizeAngle(angle + restAngle);
  return onScreen > 90 && onScreen < 270 ? angle + 180 : angle;
}

export function ChallengeWheel({ categories, rotatorRef, flapperRef, spinning, highlightIndex, restAngle, onSpin }: ChallengeWheelProps) {
  const slice = 360 / categories.length;
  const labelRadius = (OUTER + INNER) / 2 + 2;

  return (
    <div className="relative aspect-square w-full">
      <svg className="block size-full overflow-visible" viewBox="0 0 600 600" role="img"
        aria-label={`${categories.length}-part challenge wheel; the flapper at the top marks the winning category`}>
        <defs>
          <radialGradient id="peg" cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".45" stopColor="#e3eaf7" />
            <stop offset="1" stopColor="#8fa3cb" />
          </radialGradient>
          <linearGradient id="flapper" x1="0" x2="1">
            <stop offset="0" stopColor="#3a74ea" />
            <stop offset=".38" stopColor="#1650cc" />
            <stop offset="1" stopColor="#062a7a" />
          </linearGradient>
          <radialGradient id="pivot" cx="35%" cy="30%" r="80%">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".5" stopColor="#dbe4f5" />
            <stop offset="1" stopColor="#7d93c2" />
          </radialGradient>
          <filter id="lift" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="3" dy="6" stdDeviation="3.5" floodColor="#0b2a66" floodOpacity=".35" />
          </filter>
        </defs>

        <g className="wheel-rotator" ref={rotatorRef}>
          {categories.map((cat, index) => {
            const angle = index * slice;
            const [lx, ly] = polarPoint(angle, labelRadius);
            const active = index === highlightIndex;
            return (
              <g key={cat.id}>
                <path d={segmentPath(index, categories.length)}
                  fill={active ? 'var(--color-royal)' : index % 2 ? 'rgba(255,255,255,.42)' : 'rgba(255,255,255,.62)'}
                  stroke="rgba(11,42,102,.22)" strokeWidth="2" className="transition-[fill] duration-300" />
                <text transform={`translate(${lx.toFixed(3)} ${ly.toFixed(3)}) rotate(${labelRotation(angle, restAngle)})`}
                  fill={active ? '#fff' : 'var(--color-navy)'} textAnchor="middle"
                  fontSize="23" fontWeight="600" letterSpacing="2.6">
                  <tspan x="0" dy="-4">{cat.lines[0]}</tspan>
                  <tspan x="0" dy="27">{cat.lines[1]}</tspan>
                </text>
              </g>
            );
          })}
          {categories.map((cat, index) => {
            const [px, py] = polarPoint(index * slice + slice / 2, PEG_RADIUS);
            return (
              <g key={`peg-${cat.id}`}>
                <circle cx={px} cy={py} r="11" fill="rgba(11,42,102,.16)" />
                <circle cx={px} cy={py} r="8.5" fill="url(#peg)" stroke="rgba(11,42,102,.35)" strokeWidth="1" />
              </g>
            );
          })}
        </g>
        <circle cx="300" cy="300" r={OUTER + 1} fill="none" stroke="rgba(255,255,255,.75)" strokeWidth="3" />

        <g filter="url(#lift)" aria-hidden="true">
          <g ref={flapperRef} style={{ transformOrigin: `300px ${PIVOT_Y}px` }}>
            <path d="M282 -44 C282 -67 318 -67 318 -44 L305 24 Q300 34 295 24 Z" fill="url(#flapper)" />
            <path d="M287 -46 C288 -58 296 -61 300 -61 L297 18 Q295 22 294 16 Z" fill="#fff" opacity=".22" />
          </g>
          <circle cx="300" cy={PIVOT_Y} r="11" fill="url(#pivot)" stroke="rgba(11,42,102,.4)" strokeWidth="1" />
          <circle cx="300" cy={PIVOT_Y} r="3" fill="var(--color-navy)" opacity=".7" />
        </g>
      </svg>
      <button type="button" onClick={onSpin} disabled={spinning} aria-label="Spin the wheel"
        className="absolute top-1/2 left-1/2 grid aspect-square w-[28%] -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white shadow-[0_6px_18px_rgba(11,42,102,.18)] transition-transform duration-200 hover:scale-[1.04] disabled:cursor-wait">
        <GdgLogo className="w-[64%]" />
      </button>
    </div>
  );
}
