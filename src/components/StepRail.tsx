const STEPS = ['Spin the wheel', 'Pick a card', 'Solve the challenge', 'Collect your stamp'] as const;
const SHORT = ['Spin', 'Pick a card', 'Solve', 'Stamp'] as const;

interface StepRailProps {
  /** Index of the step the player is on now. */
  current: number;
}

/** A vertical checklist on desktop, a row of chips on phones. */
export function StepRail({ current }: StepRailProps) {
  return (
    <ol aria-label="How to play" className="flex flex-col gap-[22px] text-[15px] max-[900px]:flex-row max-[900px]:flex-wrap max-[900px]:gap-1.5 max-[900px]:text-[11px]">
      {STEPS.map((step, i) => {
        const on = i === current;
        return (
          <li key={step} aria-current={on ? 'step' : undefined}
            className={`flex items-center gap-3 ${on ? 'font-semibold' : 'opacity-90'} max-[900px]:rounded-full max-[900px]:border max-[900px]:px-2.5 max-[900px]:py-1.5 max-[900px]:font-normal ${on ? 'max-[900px]:border-royal max-[900px]:bg-royal max-[900px]:text-white' : 'max-[900px]:border-navy/20 max-[900px]:bg-white/30'}`}>
            <i className={`inline-block size-3.5 rounded-full border-2 max-[900px]:hidden ${on ? 'border-royal bg-royal' : 'border-navy'}`} aria-hidden="true" />
            <span className="max-[900px]:hidden">{step}</span>
            <span className="hidden max-[900px]:inline">{SHORT[i]}</span>
          </li>
        );
      })}
    </ol>
  );
}
