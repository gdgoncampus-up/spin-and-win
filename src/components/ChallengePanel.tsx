import type { CSSProperties } from 'react';
import type { Category, WheelState } from '../types';
import { Glyph } from './Glyph';

interface ChallengePanelProps {
  categories: readonly Category[];
  state: WheelState;
  onSpin: () => void;
}

export function ChallengePanel({ categories, state, onSpin }: ChallengePanelProps) {
  const selected = state.status === 'winner' && state.winnerIndex !== null
    ? categories[state.winnerIndex] : undefined;
  const spinning = state.status === 'spinning';
  return (
    <div className="panel">
      <div className="panel-kicker">
        <span>Your next challenge</span>
        <span className="small-indicator">{spinning ? 'Spinning' : selected ? 'Category selected' : 'Ready to play'}</span>
      </div>
      <div className="result-box" data-state={state.status}
        style={selected ? ({ '--winner': selected.color } as CSSProperties) : undefined}>
        <div className="result-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><Glyph name={selected?.icon ?? 'sparkle'}/></svg>
        </div>
        <h2 className="result-title" aria-live="polite" aria-atomic="true">
          {spinning ? 'Here we go…' : selected ? selected.name + (/[!?]$/.test(selected.name) ? '' : '!') : 'Ready when you are.'}
        </h2>
        <p className="result-description">
          {spinning ? 'Watch where the pointer lands. Your next challenge is coming up!'
            : selected ? selected.description
            : 'Give the wheel a spin, then pick a printed card from the selected category.'}
        </p>
      </div>
      <p className="panel-section-label">The six categories</p>
      <div className="legend" aria-label="Possible challenge categories">
        {categories.map(cat => (
          <div key={cat.id}
            className={`legend-item${selected?.id === cat.id ? ' is-current' : ''}`}
            style={{ '--dot': cat.color } as CSSProperties}>
            <span className="color-dot" aria-hidden="true"/><span>{cat.name}</span>
          </div>
        ))}
      </div>
      <button type="button" className="primary-spin" onClick={onSpin} disabled={spinning}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 1-2.4-5.7M20 4v7h-7"/></svg>
        <span>{spinning ? 'Spinning…' : selected ? 'Spin again' : 'Spin the wheel'}</span>
      </button>
      <p className="panel-hint">Press <strong>Space</strong> to spin • Draw 1 card • Have fun!</p>
    </div>
  );
}
