import type { IconName } from '../types';

interface GlyphProps { name: IconName }

/** Small inline SVG line drawings, no icon library or network calls. */
export function Glyph({ name }: GlyphProps) {
  switch (name) {
    case 'sparkle':
      return <path d="M12 2.5 14.7 9.3 21.5 12 14.7 14.7 12 21.5 9.3 14.7 2.5 12 9.3 9.3z" />;
    case 'shield':
      return <><path d="m12 2 8 3.5v6.1c0 5.1-3.2 8.3-8 10.4-4.8-2.1-8-5.3-8-10.4V5.5L12 2z"/><path d="m8.5 11.7 2.5 2.5 4.8-5.1"/></>;
    case 'monitor':
      return <><rect x="2.5" y="4" width="19" height="14" rx="2"/><path d="M8 22h8M12 18v4"/><path d="M10 9a2.2 2.2 0 0 1 4.3.6c0 1.2-2.3 1.4-2.3 2.8M12 15h.01"/></>;
    case 'bug':
      return <><path d="M8 8a4 4 0 0 1 8 0v8a4 4 0 0 1-8 0V8z"/><path d="M5 10h14M5 15h14M4 6l3 3m13-3-3 3M4 19l3-3m13 3-3-3M9 3l3 2 3-2"/></>;
    case 'bulb':
      return <><path d="M9 18h6M10 21h4M8.3 14.6A7 7 0 1 1 15.7 14.6c-.9.8-1.4 1.8-1.6 3.4h-4.2c-.2-1.6-.7-2.6-1.6-3.4z"/></>;
    case 'dice':
      return <><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01" strokeWidth="3.5"/></>;
  }
}
