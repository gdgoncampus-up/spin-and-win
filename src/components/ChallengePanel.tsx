import type { Category, WheelState } from '../types';

interface ChallengePanelProps {
  categories: readonly Category[];
  state: WheelState;
  onSpin: () => void;
}

export function ChallengePanel({ categories, state, onSpin }: ChallengePanelProps) {
  const spinning = state.status === 'spinning';
  const index = state.status === 'winner' ? state.winnerIndex : null;
  const selected = index !== null ? categories[index] : undefined;

  const kicker = spinning ? 'Spinning' : selected ? `Landed on · ${String(index! + 1).padStart(2, '0')}` : 'Ready when you are';
  const title = spinning ? 'Here we go…' : selected ? selected.name : 'Tap to spin';
  const body = spinning ? 'Watch where the pointer lands.'
    : selected ? selected.description
      : 'Six categories. One random challenge. No tech degree required.';

  return (
    <div className="glass rounded-[22px] p-7 max-[900px]:px-[18px] max-[900px]:py-4">
      <p className="text-xs tracking-[.16em] uppercase opacity-80 max-[900px]:text-[10px]">{kicker}</p>
      <h2 className="mt-3 mb-2.5 text-[38px] leading-[1.05] font-medium tracking-[-.02em] max-[900px]:mt-1.5 max-[900px]:mb-1.5 max-[900px]:text-[26px]"
        aria-live="polite" aria-atomic="true">{title}</h2>
      <p className="text-[15px] leading-normal opacity-85 max-[900px]:text-[13px]">{body}</p>
      <button type="button" onClick={onSpin} disabled={spinning}
        className="mt-[22px] inline-flex cursor-pointer items-center gap-3 rounded-full bg-royal py-1.5 pr-1.5 pl-[22px] text-base font-semibold text-white transition-[filter] hover:brightness-110 disabled:cursor-wait disabled:opacity-80 max-[900px]:mt-3 max-[900px]:flex max-[900px]:w-full max-[900px]:justify-between max-[900px]:pl-5 max-[900px]:text-[15px]">
        {spinning ? 'Spinning…' : selected ? 'Spin again' : 'Spin the wheel'}
        <span className="grid size-10 place-items-center rounded-full bg-white text-royal" aria-hidden="true">
          <svg className="size-[18px] fill-none stroke-current stroke-[2.2] [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </span>
      </button>
    </div>
  );
}
