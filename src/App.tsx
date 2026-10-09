import { useEffect, useRef, useState } from 'react';
import { ChallengeWheel } from './components/ChallengeWheel';
import { ChallengePanel } from './components/ChallengePanel';
import { Confetti } from './components/Confetti';
import { Header } from './components/Header';
import { EVENT } from './config/event';
import { useWheel } from './hooks/useWheel';
import { useSound } from './hooks/useSound';

const STEPS = ['Spin the wheel', 'Pick a matching card', 'Complete the challenge', 'Collect your stamp!'];

export default function App() {
  const { state, rotatorRef, spin } = useWheel(EVENT.categories.length);
  const { enabled, toggle, playWinSound } = useSound();
  const [burst, setBurst] = useState(0);
  const lastCelebrated = useRef<typeof state | null>(null);

  useEffect(() => {
    if (state.status === 'winner' && lastCelebrated.current !== state) {
      lastCelebrated.current = state;
      setBurst(value => value + 1);
      playWinSound();
    }
  }, [state, playWinSound]);

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

  return (
    <>
      <a href="#game" className="fixed -top-24 left-3 z-99 rounded-lg bg-white px-5 py-3 text-[#111] focus:top-3">Skip to wheel</a>
      <div className="relative mx-auto w-[min(1320px,calc(100%-64px))] max-[900px]:w-[min(780px,calc(100%-36px))] kiosk:flex kiosk:h-dvh kiosk:w-[min(1440px,calc(100%-48px))] kiosk:flex-col short:w-[calc(100%-32px)] portrait-tab:flex portrait-tab:h-dvh portrait-tab:w-[calc(100%-32px)] portrait-tab:flex-col">
        <Header event={EVENT} soundEnabled={enabled} onToggleSound={toggle} />
        <main id="game" className="kiosk:flex kiosk:min-h-0 kiosk:flex-1 kiosk:flex-col portrait-tab:flex portrait-tab:min-h-0 portrait-tab:flex-1 portrait-tab:flex-col">
          <section className="pt-[34px] pb-0.5 text-center max-[900px]:pt-7 kiosk:shrink-0 kiosk:pt-[clamp(7px,1.4dvh,17px)] portrait-tab:shrink-0 portrait-tab:pt-2.5 short:pt-1" aria-labelledby="page-title">
            <p className="eyebrow mb-[11px] inline-flex items-center gap-2 text-[11px] font-extrabold tracking-[.24em] text-[#91b8ff] uppercase kiosk:mb-1 kiosk:text-[clamp(9px,1.1dvh,11px)] portrait-tab:mb-1 portrait-tab:text-[9px] short:hidden">
              {EVENT.eyebrow}
            </p>
            <h1 id="page-title" className="m-0 text-[clamp(31px,3.8vw,53px)] leading-[1.11] font-[850] tracking-[-.055em] kiosk:text-[clamp(27px,4.15dvh,46px)] kiosk:leading-[1.06] portrait-tab:text-[clamp(27px,3.6dvh,36px)] portrait-tab:leading-[1.05] short:text-[clamp(24px,4.3dvh,31px)]">
              {EVENT.headline}<br /><span className="gradient-title">{EVENT.gradientHeadline}</span>
            </h1>
            <p className="mx-auto mt-[13px] max-w-[650px] text-[15px] leading-[1.6] text-[#a7b4cc] max-[570px]:mt-2.5 max-[570px]:text-[13px] kiosk:mt-[7px] kiosk:text-[clamp(11px,1.38dvh,14px)] kiosk:leading-[1.32] portrait-tab:mt-1.5 portrait-tab:text-xs portrait-tab:leading-[1.3] short:mt-1 short:text-[11px] short:leading-[1.2]">
              {EVENT.subtitle}<br />{EVENT.subtitleLine2}
            </p>
          </section>
          <section aria-label="Challenge wheel game" className="grid grid-cols-[minmax(0,1.17fr)_minmax(345px,.83fr)] items-center gap-[min(3vw,38px)] pt-[22px] pb-[15px] max-[900px]:grid-cols-1 max-[900px]:gap-0 kiosk:min-h-0 kiosk:flex-1 kiosk:grid-cols-[minmax(0,1.12fr)_minmax(0,.88fr)] kiosk:items-stretch desktop:items-center touch-landscape:items-center kiosk:gap-[clamp(12px,2vw,32px)] kiosk:py-[clamp(7px,1.1dvh,13px)] portrait-tab:min-h-0 portrait-tab:flex-1 portrait-tab:grid-cols-1 portrait-tab:grid-rows-[minmax(0,1fr)_minmax(0,1fr)] portrait-tab:items-stretch portrait-tab:gap-1.5 portrait-tab:py-2 short:grid-cols-2 short:gap-3 short:py-1">
            <ChallengeWheel categories={EVENT.categories} rotatorRef={rotatorRef} spinning={state.status === 'spinning'} onSpin={spin} />
            <ChallengePanel categories={EVENT.categories} state={state} onSpin={spin} />
          </section>
          <div className="flex flex-wrap items-center justify-center gap-[13px] border-t border-white/[.075] pt-3.5 pb-[23px] max-[570px]:gap-[7px] kiosk:shrink-0 kiosk:flex-nowrap kiosk:gap-[clamp(8px,1vw,16px)] kiosk:py-2 portrait-tab:hidden short:py-1" aria-label="How to play">
            {STEPS.map((step, i) => (
              <div key={step} className="contents">
                {i > 0 && <span className="text-[#4a5977] max-[570px]:w-[11px]" aria-hidden="true">→</span>}
                <div className="flex items-center gap-[9px] whitespace-nowrap text-xs font-semibold text-[#b1bfd7] max-[570px]:gap-1.5 max-[570px]:text-[10px] kiosk:gap-1.5 kiosk:text-[clamp(10px,1.25dvh,12px)]">
                  <span className="grid size-6 shrink-0 place-items-center rounded-lg border border-white/[.09] bg-white/[.075] text-[10px] font-extrabold text-[#c7d8f8] kiosk:size-[22px]">{String(i + 1).padStart(2, '0')}</span>
                  {step}
                </div>
              </div>
            ))}
          </div>
        </main>
        <footer className="flex justify-between gap-4 py-[15px] pb-5 text-[11px] tracking-[.02em] text-[#6f7c99] max-[570px]:flex-col max-[570px]:items-center max-[570px]:gap-1 max-[570px]:text-center max-[570px]:text-[10px] kiosk:shrink-0 kiosk:py-2 portrait-tab:hidden short:hidden">
          <span>{EVENT.chapterName} · {EVENT.universityName}</span>
          <span>{EVENT.footerNote}</span>
        </footer>
      </div>
      <Confetti burst={burst} categories={EVENT.categories} />
    </>
  );
}
