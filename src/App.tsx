import { useEffect, useRef, useState } from 'react';
import { ChallengeWheel } from './components/ChallengeWheel';
import { ChallengePanel } from './components/ChallengePanel';
import { Confetti } from './components/Confetti';
import { Header } from './components/Header';
import { CATEGORIES } from './data/categories';
import { useWheel } from './hooks/useWheel';
import { useSound } from './hooks/useSound';

export default function App() {
  const { state, rotatorRef, spin } = useWheel(CATEGORIES.length);
  const { enabled, toggle, playWinSound } = useSound();
  const [burst, setBurst] = useState(0);
  const lastCelebrated = useRef<typeof state | null>(null);

  useEffect(() => {
    // Each completed spin produces a new state object, even when its result
    // happens to match the previous category.
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
      <a className="skip" href="#game">Skip to wheel</a>
      <div className="shell">
        <Header soundEnabled={enabled} onToggleSound={toggle}/>
        <main id="game">
          <section className="intro" aria-labelledby="page-title">
            <p className="eyebrow">A little challenge. A lot of fun.</p>
            <h1 id="page-title">Spin the wheel.<br/><span className="gradient">Discover your challenge.</span></h1>
            <p className="subtitle">Six categories. One random challenge. No tech degree required.<br/>Ready to put your curiosity to the test?</p>
          </section>
          <section className="stage" aria-label="Challenge wheel game">
            <ChallengeWheel categories={CATEGORIES} rotatorRef={rotatorRef} spinning={state.status === 'spinning'} onSpin={spin}/>
            <ChallengePanel categories={CATEGORIES} state={state} onSpin={spin}/>
          </section>
          <div className="steps" aria-label="How to play">
            <div className="step"><span className="step-num">01</span> Spin the wheel</div><span className="step-arrow" aria-hidden="true">→</span>
            <div className="step"><span className="step-num">02</span> Pick a matching card</div><span className="step-arrow" aria-hidden="true">→</span>
            <div className="step"><span className="step-num">03</span> Complete the challenge</div><span className="step-arrow" aria-hidden="true">→</span>
            <div className="step"><span className="step-num">04</span> Collect your stamp!</div>
          </div>
        </main>
        <footer className="footer">
          <span>GDG on Campus · University of Primorska</span>
          <span>Made for ŠtartUP 2026 · No external assets</span>
        </footer>
      </div>
      <Confetti burst={burst} categories={CATEGORIES}/>
    </>
  );
}
