# GDG on Campus UP — ŠtartUP 2026 Challenge Wheel

A polished, reusable **React + Vite + TypeScript** spinning wheel for GDG on Campus University of Primorska. It chooses one of six challenge categories corresponding to the printed activity cards.

## Quick start

You need **Node.js 22.12+** and npm. In this folder:

```bash
npm install
npm run dev
```

Open the localhost URL that Vite prints (normally `http://localhost:5173`).

### Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run development server |
| `npm run build` | Type-check then bundle to `dist/` |
| `npm run preview` | Test production build locally |
| `npm run typecheck` | Type-check the TypeScript project |
| `npm test` | Check wheel alignment mathematics (Node 22+) |

## Tablet layout (no scrolling)

The interface automatically switches to a **single-screen kiosk layout** on
landscape tablets, compact laptop windows, and portrait tablets. It sizes the
wheel from **available viewport height**, not only width, and compresses the
header and challenge panel for short displays. No horizontal or vertical
scrolling is required on common tablet landscape sizes (e.g. 1280×800,
1024×768, 960×600) or portrait sizes (768×1024, 800×1280).

The game remains usable on smaller phones and unusually short browser windows;
these can scroll rather than hiding essential controls. If a browser has
large UI bars, use the fullscreen button in the upper right to maximize room.

## For tomorrow's booth

1. Install dependencies and build **before** the event, while internet is available.
2. Keep the `dist/` folder on your laptop.
3. Start a local HTTP server (no internet required after dependencies are installed and built):

   ```bash
   cd dist
   python3 -m http.server 8080 --bind 127.0.0.1
   ```

4. Open `http://localhost:8080/`. Use the top-right fullscreen button (or F11).
5. Students spin, choose a printed card matching the color/category, answer, and collect a stamp.

**Backup:** `offline-backup/index.html` contains the original standalone, non-React wheel. It opens directly without a local server. The React project itself needs to be built and served over HTTP; opening `dist/index.html` directly via `file://` can fail because browsers restrict module loading.

## Edit the wheel

- **Categories:** `src/data/categories.ts` — change names, colors, descriptions, two-line wheel labels. No need to edit SVG markup.
- **Wheel geometry:** `src/lib/wheelMath.ts` — pure, unit-tested geometry and pointer alignment.
- **Spin timing/selection:** `src/hooks/useWheel.ts` — duration, turns, safe random jitter.
- **Sound:** `src/hooks/useSound.ts` — generated Web Audio tones; no external files.
- **Icons:** `src/components/Glyph.tsx` — locally drawn SVG paths.
- **Styling:** `src/styles.css` — the look from the original standalone wheel.

Current order / printed-card colors:

1. Google & Tech — blue
2. Cyber Smart — red
3. Guess the Tech — green
4. Debug It! — orange
5. Tech Trivia — purple
6. Wildcard — pink

All segments have equal probability. There is no tracking, no database, no API, no external CDN, and no server-side code. The game supports sound toggle, fullscreen, keyboard Space, and reduced-motion settings.

## Self-host using Caddy

Run `npm run build` on your laptop or CI, copy the contents of `dist/` to a directory on your Caddy host (for example `/srv/gdg-wheel`), then configure a virtual host:

```caddyfile
wheel.example.com {
    root * /srv/gdg-wheel
    encode zstd gzip
    try_files {path} /index.html
    file_server
}
```

If your DNS and Cloudflare Tunnel already route `wheel.example.com` to Caddy, no extra backend is needed. Replace the example hostname with your own domain. For access on two local devices, host over your laptop's LAN address and make sure both devices can reach it; this requires only a working LAN/Wi-Fi, not an internet connection.

## Project layout

```text
gdg-startup-wheel-react/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   ├── types.ts
│   ├── components/
│   │   ├── ChallengeWheel.tsx
│   │   ├── ChallengePanel.tsx
│   │   ├── Confetti.tsx
│   │   ├── Header.tsx
│   │   └── Glyph.tsx
│   ├── data/categories.ts
│   ├── hooks/useWheel.ts
│   ├── hooks/useSound.ts
│   └── lib/
│       ├── random.ts
│       ├── wheelMath.ts
│       └── wheelMath.test.ts
└── offline-backup/index.html
```

## License / community use

This sample is independently authored for the user's GDG on Campus project, with no proprietary logos or bundled Google brand assets. If publishing it, choose your preferred repository license and follow relevant GDG/Google branding guidance. Do not mistake the custom four-color mark for an official GDG logo.
