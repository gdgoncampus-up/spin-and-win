/**
 * A small canvas particle engine for the win celebration. Each category bursts
 * its own symbol with its own motion, mixed with paper that flips in 3D.
 */

interface CategoryLook {
  glyph: string;
  color: string;
  /** How fast symbols tumble, radians per frame. */
  spin: number;
  /** Symbols pulse in size (stars twinkle). */
  twinkle: boolean;
  gravity: number;
}

const LOOKS: Record<string, CategoryLook> = {
  google: { glyph: '</>', color: '#4285F4', spin: 0.05, twinkle: false, gravity: 0.2 },
  cyber: { glyph: 'shield', color: '#EA4335', spin: 0.015, twinkle: false, gravity: 0.26 },
  guess: { glyph: '?', color: '#34A853', spin: 0.12, twinkle: false, gravity: 0.18 },
  debug: { glyph: '{ }', color: '#DA9600', spin: 0.07, twinkle: false, gravity: 0.22 },
  trivia: { glyph: '!', color: '#7657D9', spin: 0.04, twinkle: false, gravity: 0.24 },
  wild: { glyph: '★', color: '#D44C9A', spin: 0.06, twinkle: true, gravity: 0.14 },
};

type Kind = 'paper' | 'dot' | 'glyph';

interface Particle {
  kind: Kind;
  x: number; y: number; vx: number; vy: number;
  rot: number; vrot: number;
  flip: number; vflip: number;
  w: number; h: number;
  color: string;
  gravity: number; drag: number;
  life: number; maxLife: number;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function burst(x: number, y: number, speed: [number, number], spread: number) {
  const a = -Math.PI / 2 + rand(-spread / 2, spread / 2);
  const v = rand(...speed);
  return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v };
}

function seed(look: CategoryLook, ox: number, oy: number, width: number): Particle[] {
  const scale = Math.min(1.2, Math.max(0.6, width / 1200));
  const out: Particle[] = [];
  for (let i = 0; i < 46; i++) {
    out.push({ kind: 'glyph', color: Math.random() < 0.75 ? look.color : '#ffffff', ...burst(ox, oy, [6, 16 * scale], Math.PI * 1.6),
      rot: rand(-0.6, 0.6), vrot: rand(-look.spin, look.spin), flip: rand(0, 6.28), vflip: rand(0.1, 0.2),
      w: rand(22, 40), h: 0, gravity: look.gravity, drag: 0.97, life: 0, maxLife: rand(170, 240) });
  }
  for (let i = 0; i < 80; i++) {
    out.push({ kind: Math.random() < 0.2 ? 'dot' : 'paper', color: Math.random() < 0.55 ? look.color : '#ffffff', ...burst(ox, oy, [6, 18 * scale], Math.PI * 1.5),
      rot: rand(0, 6.28), vrot: rand(-0.2, 0.2), flip: rand(0, 6.28), vflip: rand(0.08, 0.22),
      w: rand(6, 11), h: rand(9, 16), gravity: 0.3, drag: 0.972, life: 0, maxLife: rand(170, 240) });
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

function draw(ctx: CanvasRenderingContext2D, p: Particle, look: CategoryLook) {
  const fade = Math.min(1, (p.maxLife - p.life) / 30);
  if (fade <= 0) return;
  ctx.save();
  ctx.globalAlpha = fade;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.fillStyle = p.color;
  if (p.kind === 'paper') {
    // Squashing one axis by cos(flip) fakes a sheet turning over in 3D; its back reads a little darker.
    const turn = Math.cos(p.flip);
    ctx.scale(1, turn);
    if (turn < 0) ctx.globalAlpha = fade * 0.75;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
  } else if (p.kind === 'dot') {
    ctx.beginPath();
    ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const size = look.twinkle ? p.w * (1 + 0.25 * Math.sin(p.life * 0.3)) : p.w;
    ctx.scale(Math.cos(p.flip * 0.5) * 0.3 + 0.7, 1); // a gentle turn in depth
    if (look.glyph === 'shield') shield(ctx, size);
    else {
      ctx.font = `700 ${size}px "Inter Tight Variable", system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(look.glyph, 0, 0);
    }
  }
  ctx.restore();
}

/** Runs one celebration for the given category; returns a function that stops it. */
export function launchConfetti(canvas: HTMLCanvasElement, origin: { x: number; y: number }, categoryId: string): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};
  const look = LOOKS[categoryId] ?? LOOKS.google!;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  let particles = seed(look, origin.x, origin.y, w);
  let frame = 0;
  const step = () => {
    ctx.clearRect(0, 0, w, h);
    particles = particles.filter(p => p.life < p.maxLife && p.y < h + 200);
    for (const p of particles) {
      p.life += 1;
      p.vx = p.vx * p.drag + (p.kind === 'paper' ? Math.sin(p.flip) * 0.06 : 0); // paper flutters sideways as it turns
      p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      p.flip += p.vflip;
      draw(ctx, p, look);
    }
    if (particles.length) frame = requestAnimationFrame(step);
    else ctx.clearRect(0, 0, w, h);
  };
  frame = requestAnimationFrame(step);
  return () => { cancelAnimationFrame(frame); ctx.clearRect(0, 0, w, h); };
}
