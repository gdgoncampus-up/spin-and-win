import type { RefObject } from 'react';
import type { Category } from '../types';
import { normalizeAngle, polarPoint } from '../lib/wheelMath';
import { GdgLogo } from './GdgLogo';

interface ChallengeWheelProps {
  categories: readonly Category[];
  rotatorRef: RefObject<SVGGElement | null>;
  spinning: boolean;
  /** Segment drawn in solid blue: the one resting under the pointer. */
  highlightIndex: number | null;
  /** Current rest rotation, so labels can be flipped to read upright where they stopped. */
  restAngle: number;
  onSpin: () => void;
}

const OUTER = 290;
const INNER = 88;

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

export function ChallengeWheel({ categories, rotatorRef, spinning, highlightIndex, restAngle, onSpin }: ChallengeWheelProps) {
  const labelRadius = (OUTER + INNER) / 2 + 6;

  return (
    <div className="relative aspect-square w-full">
      <svg className="block size-full overflow-visible" viewBox="0 0 600 600" role="img"
        aria-label={`${categories.length}-part challenge wheel; the pointer at the top marks the winning category`}>
        <g className="wheel-rotator" ref={rotatorRef}>
          {categories.map((cat, index) => {
            const angle = index * 360 / categories.length;
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
        </g>
        <path d="M286 -10h28l-14 32z" fill="var(--color-royal)" />
      </svg>
      <button type="button" onClick={onSpin} disabled={spinning} aria-label="Spin the wheel"
        className="absolute top-1/2 left-1/2 grid aspect-square w-[28%] -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white transition-transform duration-200 hover:scale-[1.04] disabled:cursor-wait">
        <GdgLogo className="w-[64%]" />
      </button>
    </div>
  );
}
