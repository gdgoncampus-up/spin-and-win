/**
 * A small canvas particle engine. Every style is a recipe that seeds particles;
 * the engine then runs the same physics (gravity, drag, spin, 3D paper flip).
 */
export type ConfettiStyleId = 'paper' | 'cannons' | 'brackets' | 'streamers' | 'shockwave' | 'category';

export const CONFETTI_STYLES: readonly { id: ConfettiStyleId; name: string; blurb: string }[] = [
  { id: 'paper', name: 'Paper burst', blurb: 'Real-feeling paper that flips in 3D as it falls from the wheel.' },
  { id: 'cannons', name: 'Side cannons', blurb: 'Two bursts fire up from the bottom corners and rain back down.' },
  { id: 'brackets', name: 'Brackets', blurb: 'The GDG < > mark in its four colours bursts out of the hub.' },
  { id: 'streamers', name: 'Streamers', blurb: 'Curly ribbons drift down across the sky, slow and calm.' },
  { id: 'shockwave', name: 'Shockwave', blurb: 'A clean ring and sparks pulse out from the hub. Quick and minimal.' },
  { id: 'category', name: 'Per category', blurb: 'Each category gets its own symbol: </>, shields, ?, { }, !, stars.' },
];

const GOOGLE = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];
const PAPER = [...GOOGLE, '#ffffff', '#0b3fb0'];

/** Symbol and colour drawn for each category in the 'category' style. */
const CATEGORY_GLYPHS: Record<string, { glyph: string; color: string }> = {
  google: { glyph: '</>', color: '#4285F4' },
  cyber: { glyph: 'shield', color: '#EA4335' },
  guess: { glyph: '?', color: '#34A853' },
  debug: { glyph: '{ }', color: '#DA9600' },
  trivia: { glyph: '!', color: '#7657D9' },
  wild: { glyph: '★', color: '#D44C9A' },
};

type Kind = 'paper' | 'dot' | 'chevron' | 'ribbon' | 'spark' | 'ring' | 'glyph';

interface Particle {
  kind: Kind;
  x: number; y: number; vx: number; vy: number;
  rot: number; vrot: number;
  flip: number; vflip: number;
  w: number; h: number;
  color: string;
  gravity: number; drag: number;
  life: number; maxLife: number;
  glyph?: string;
  dir?: 1 | -1;
  wobble?: number;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)]!;

function base(p: Partial<Particle> & Pick<Particle, 'kind' | 'x' | 'y' | 'color'>): Particle {
  return {
    vx: 0, vy: 0, rot: rand(0, Math.PI * 2), vrot: rand(-0.2, 0.2), flip: rand(0, Math.PI * 2), vflip: rand(0.08, 0.22),
    w: 8, h: 12, gravity: 0.32, drag: 0.985, life: 0, maxLife: rand(160, 240), ...p,
  };
}

function radial(x: number, y: number, speed: [number, number], spread = Math.PI * 2, aim = -Math.PI / 2) {
  const a = aim + rand(-spread / 2, spread / 2);
  const v = rand(...speed);
  return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v };
}

function seed(style: ConfettiStyleId, ox: number, oy: number, w: number, h: number, categoryId?: string): Particle[] {
  const out: Particle[] = [];
  const scale = Math.min(1.2, Math.max(0.6, w / 1200));
  switch (style) {
    case 'paper':
      for (let i = 0; i < 170; i++) {
        out.push(base({ kind: Math.random() < 0.18 ? 'dot' : 'paper', color: pick(PAPER), ...radial(ox, oy, [7, 19 * scale], Math.PI * 1.5),
          w: rand(7, 12), h: rand(10, 18), drag: 0.972 }));
      }
      break;
    case 'cannons':
      for (const side of [-1, 1] as const) {
        const x = side < 0 ? -10 : w + 10;
        for (let i = 0; i < 110; i++) {
          out.push(base({ kind: Math.random() < 0.15 ? 'dot' : 'paper', color: pick(PAPER),
            ...radial(x, h + 10, [16 * scale + 6, 30 * scale + 6], 0.55, side < 0 ? -Math.PI / 2 + 0.55 : -Math.PI / 2 - 0.55),
            w: rand(7, 12), h: rand(10, 18), drag: 0.975, maxLife: rand(220, 300) }));
        }
      }
      break;
    case 'brackets':
      for (let i = 0; i < 46; i++) {
        out.push(base({ kind: 'chevron', color: pick(GOOGLE), ...radial(ox, oy, [6, 15 * scale]), w: rand(16, 28), h: 0,
          dir: Math.random() < 0.5 ? 1 : -1, vrot: rand(-0.06, 0.06), gravity: 0.16, drag: 0.968, maxLife: rand(170, 230) }));
      }
      break;
    case 'streamers':
      for (let i = 0; i < 34; i++) {
        out.push(base({ kind: 'ribbon', color: pick(PAPER.slice(0, 4)), x: rand(0, w), y: rand(-h * 0.5, -20), vx: rand(-0.6, 0.6), vy: rand(1.5, 3),
          w: rand(5, 7), h: rand(70, 120), gravity: 0.015, drag: 0.995, wobble: rand(0, 6), maxLife: rand(320, 420) }));
      }
      for (let i = 0; i < 50; i++) {
        out.push(base({ kind: 'paper', color: pick(PAPER), x: rand(0, w), y: rand(-h * 0.6, -10), vx: rand(-0.8, 0.8), vy: rand(1, 2.5),
          w: rand(6, 10), h: rand(9, 14), gravity: 0.02, drag: 0.99, maxLife: rand(320, 420) }));
      }
      break;
    case 'shockwave':
      out.push(base({ kind: 'ring', color: '#ffffff', x: ox, y: oy, w: 0, h: 0, gravity: 0, maxLife: 55 }));
      out.push(base({ kind: 'ring', color: '#0b3fb0', x: ox, y: oy, w: 0, h: 0, gravity: 0, maxLife: 70, life: -10 }));
      for (let i = 0; i < 36; i++) {
        const a = (i / 36) * Math.PI * 2 + rand(-0.05, 0.05);
        const v = rand(9, 16) * scale;
        out.push(base({ kind: 'spark', color: i % 3 ? '#ffffff' : pick(GOOGLE), x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
          w: rand(1.5, 3), h: rand(14, 26), gravity: 0, drag: 0.9, maxLife: rand(38, 55) }));
      }
      for (let i = 0; i < 24; i++) {
        out.push(base({ kind: 'dot', color: pick(GOOGLE), ...radial(ox, oy, [3, 9]), w: rand(4, 7), h: 0, gravity: 0.05, drag: 0.94, maxLife: rand(60, 90) }));
      }
      break;
    case 'category': {
      const look = CATEGORY_GLYPHS[categoryId ?? ''] ?? CATEGORY_GLYPHS.google!;
      for (let i = 0; i < 44; i++) {
        out.push(base({ kind: 'glyph', glyph: look.glyph, color: Math.random() < 0.75 ? look.color : '#ffffff',
          ...radial(ox, oy, [6, 16 * scale], Math.PI * 1.6), w: rand(22, 40), h: 0, vrot: rand(-0.05, 0.05), gravity: 0.2, drag: 0.97 }));
      }
      for (let i = 0; i < 60; i++) {
        out.push(base({ kind: 'paper', color: Math.random() < 0.6 ? look.color : '#ffffff', ...radial(ox, oy, [6, 17 * scale], Math.PI * 1.5),
          w: rand(6, 10), h: rand(9, 15), drag: 0.972 }));
      }
      break;
    }
  }
  return out;
}

function shield(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath();
  ctx.moveTo(0, -s / 2);
  ctx.lineTo(s * 0.42, -s * 0.32);
  ctx.quadraticCurveTo(s * 0.42, s * 0.25, 0, s / 2);
  ctx.quadraticCurveTo(-s * 0.42, s * 0.25, -s * 0.42, -s * 0.32);
  ctx.closePath();
  ctx.fill();
}

function draw(ctx: CanvasRenderingContext2D, p: Particle) {
  const fade = Math.min(1, (p.maxLife - p.life) / 30);
  if (fade <= 0 || p.life < 0) return;
  ctx.save();
  ctx.globalAlpha = fade;
  ctx.translate(p.x, p.y);
  ctx.fillStyle = p.color;
  ctx.strokeStyle = p.color;
  switch (p.kind) {
    case 'paper': {
      // Scaling one axis by cos(flip) fakes a sheet turning over in 3D; the back side reads darker.
      ctx.rotate(p.rot);
      const turn = Math.cos(p.flip);
      ctx.scale(1, turn);
      if (turn < 0) ctx.globalAlpha = fade * 0.75;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      break;
    }
    case 'dot':
      ctx.beginPath();
      ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'chevron':
      ctx.rotate(p.rot);
      ctx.lineCap = 'round';
      ctx.lineWidth = p.w * 0.32;
      ctx.beginPath();
      ctx.moveTo(p.dir! * p.w * 0.35, -p.w * 0.4);
      ctx.lineTo(-p.dir! * p.w * 0.35, 0);
      ctx.lineTo(p.dir! * p.w * 0.35, p.w * 0.4);
      ctx.stroke();
      break;
    case 'ribbon': {
      ctx.rotate(Math.sin(p.flip * 0.5) * 0.3);
      ctx.lineWidth = p.w;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let s = 0; s <= 12; s++) {
        const y = (s / 12) * p.h - p.h / 2;
        const x = Math.sin(s * 0.9 + p.flip + p.wobble!) * 9;
        if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      break;
    }
    case 'spark': {
      const a = Math.atan2(p.vy, p.vx);
      ctx.rotate(a);
      ctx.lineCap = 'round';
      ctx.lineWidth = p.w;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-p.h * Math.min(1, Math.hypot(p.vx, p.vy) / 6), 0);
      ctx.stroke();
      break;
    }
    case 'ring': {
      const t = p.life / p.maxLife;
      const r = 40 + (1 - (1 - t) ** 3) * 340;
      ctx.globalAlpha = (1 - t) * 0.9;
      ctx.lineWidth = 6 * (1 - t) + 1;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case 'glyph':
      ctx.rotate(p.rot);
      if (p.glyph === 'shield') shield(ctx, p.w);
      else {
        ctx.font = `700 ${p.w}px "Inter Tight Variable", system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.glyph!, 0, 0);
      }
      break;
  }
  ctx.restore();
}

/** Runs one celebration on the canvas and resolves when the last particle is gone. */
export function launchConfetti(canvas: HTMLCanvasElement, style: ConfettiStyleId, origin: { x: number; y: number }, categoryId?: string): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  let particles = seed(style, origin.x, origin.y, w, h, categoryId);
  let frame = 0;
  const step = () => {
    ctx.clearRect(0, 0, w, h);
    particles = particles.filter(p => p.life < p.maxLife && p.y < h + 200);
    for (const p of particles) {
      p.life += 1;
      if (p.life < 0) continue;
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      if (p.kind === 'paper' || p.kind === 'ribbon') p.vx += Math.sin(p.flip) * 0.06; // paper flutters sideways as it turns
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      p.flip += p.vflip;
      draw(ctx, p);
    }
    if (particles.length) frame = requestAnimationFrame(step);
    else ctx.clearRect(0, 0, w, h);
  };
  frame = requestAnimationFrame(step);
  return () => { cancelAnimationFrame(frame); ctx.clearRect(0, 0, w, h); };
}
