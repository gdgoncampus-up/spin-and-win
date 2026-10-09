import { useEffect, useRef, useState } from 'react';
import { ChallengeWheel } from './components/ChallengeWheel';
import { ChallengePanel } from './components/ChallengePanel';
import { Confetti } from './components/Confetti';
import { Header } from './components/Header';
import { StepRail } from './components/StepRail';
import { EVENT } from './config/event';
import { useWheel } from './hooks/useWheel';
import { useSound } from './hooks/useSound';
import { useSpinCount } from './hooks/useSpinCount';

export default function App() {
  const { state, rotatorRef, spin } = useWheel(EVENT.categories.length);
  const { enabled, toggle, playWinSound } = useSound();
  const { count, increment } = useSpinCount();
  const [burst, setBurst] = useState(0);
  const lastCelebrated = useRef<typeof state | null>(null);

  useEffect(() => {
    if (state.status === 'winner' && lastCelebrated.current !== state) {
      lastCelebrated.current = state;
      setBurst(value => value + 1);
      increment();
      playWinSound();
    }
  }, [state, playWinSound, increment]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
      const active = document.activeElement?.tagName;
      if (active && ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(active)) return;
      event.preventDefault();
      spin();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [spin]);

  const spinning = state.status === 'spinning';

  return (
    <>
      <a href="#game" className="fixed -top-24 left-3 z-99 rounded-lg bg-white px-5 py-3 focus:top-3">Skip to wheel</a>
      <div className="relative mx-auto flex min-h-dvh w-[min(1440px,calc(100%-96px))] flex-col max-[900px]:w-[calc(100%-36px)]">
        <Header event={EVENT} soundEnabled={enabled} onToggleSound={toggle} />

        <span className="glass mt-3.5 hidden self-start rounded-full px-3 py-1.5 text-xs max-[900px]:inline-flex max-[900px]:items-center max-[900px]:gap-1.5"><i className="size-1.5 rounded-full bg-navy" aria-hidden="true" />{EVENT.eventName}</span>

        <main id="game" className="relative z-10 grid flex-1 grid-cols-[1fr_auto_1fr] items-start gap-10 pt-[clamp(24px,5vh,70px)] max-[900px]:flex max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:gap-0 max-[900px]:pt-3.5">
          <div className="pt-[clamp(0px,8vh,80px)] max-[900px]:pt-0">
            <StepRail current={state.status === 'winner' ? 1 : 0} />
          </div>

          <div className="w-[clamp(300px,30vw,520px)] max-[900px]:mx-auto max-[900px]:mt-[22px] max-[900px]:w-[min(78vw,340px)]">
            <ChallengeWheel categories={EVENT.categories} rotatorRef={rotatorRef} spinning={spinning}
              highlightIndex={spinning ? null : state.winnerIndex ?? 0} restAngle={state.restAngle} onSpin={spin} />
          </div>

          <div className="flex flex-col items-end gap-[clamp(40px,12vh,140px)] pt-[clamp(0px,6vh,60px)] max-[900px]:mt-4 max-[900px]:items-stretch max-[900px]:pt-0">
            <div className="w-full max-w-[450px] max-[900px]:max-w-none">
              <ChallengePanel categories={EVENT.categories} state={state} onSpin={spin} />
            </div>
            {count > 0 && (
              <p className="glass flex items-center gap-3.5 rounded-full py-2.5 pr-4 pl-[22px] text-sm max-[900px]:hidden">
                <span className="flex" aria-hidden="true">
                  <b className="-ml-2.5 size-[30px] rounded-full border-2 border-white bg-royal" />
                  <b className="-ml-2.5 size-[30px] rounded-full border-2 border-white bg-white" />
                  <b className="-ml-2.5 size-[30px] rounded-full border-2 border-white bg-[#8fb3ff]" />
                </span>
                <span><b className="text-lg">{count}</b> {count === 1 ? 'spin' : 'spins'} at the booth today</span>
              </p>
            )}
          </div>
        </main>

        <p aria-hidden="true"
          className="pointer-events-none relative z-0 mt-auto pb-[clamp(16px,3vh,40px)] text-[clamp(46px,11vw,190px)] leading-[.86] font-light tracking-[-.045em] text-white [text-shadow:0_4px_40px_rgba(8,40,120,.35)] select-none max-[900px]:pt-10 max-[900px]:leading-[.9]">
          SPIN. PLAY.<span className="block text-right">LEARN TECH</span>
        </p>
      </div>
      <Confetti burst={burst} categories={EVENT.categories} />
    </>
  );
}
