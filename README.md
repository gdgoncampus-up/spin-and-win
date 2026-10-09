# GDG Challenge Wheel

A reusable, self-hostable challenge wheel for **GDG on Campus — University of Primorska**.

Current event: **ŠtartUP 2026**. Visitors spin a six-category wheel, draw a matching **physical challenge card**, complete it, and receive a stamp.

Built with **React 19, TypeScript, Vite 7, and Tailwind CSS v4**. No backend, database, icon library, web fonts, or external API requests are required at runtime.

## Quick start

Requires Node.js **22.12+** and npm.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).

```bash
npm run test       # Unit tests for wheel selection and pointer alignment
npm run typecheck  # TypeScript check
npm run build      # Output to dist/
npm run preview    # Preview the production output
```

> If you used a previous version of this project, run `npm install` again. Tailwind v4 and the Vite plugin are new dependencies.

## Project layout

```text
gdg-challenge-wheel/
├── index.html                     # Minimal Vite mount point, not UI markup
├── vite.config.ts                 # Vite + React + Tailwind v4
├── src/
│   ├── config/event.ts            # Event copy and current category selection
│   ├── data/categories.ts         # Six currently hardcoded categories
│   ├── components/
│   │   ├── ChallengeWheel.tsx     # SVG slices, labels, pointer and spin button
│   │   ├── ChallengePanel.tsx     # Result, category legend and repeat button
│   │   ├── Header.tsx             # Event badge, sound and fullscreen controls
│   │   ├── Confetti.tsx           # Celebration particles
│   │   └── Glyph.tsx              # Tiny inline icon drawings
│   ├── hooks/useWheel.ts          # Spin state and animation
│   ├── hooks/useSound.ts          # Optional Web Audio sound
│   ├── lib/wheelMath.ts           # Framework-independent wheel geometry
│   ├── lib/wheelMath.test.ts      # Wheel alignment tests
│   ├── styles.css                 # Tailwind import + special visuals/breakpoints
│   ├── App.tsx                    # Composes the screen
│   └── main.tsx                   # React entrypoint
└── package.json
```

## Customization (hardcoded for now)

- Change the **event title, university name, intro copy, footer text, and category list** in `src/config/event.ts`.
- Change **category names, colors, icons, labels and instructions** in `src/data/categories.ts`.
- `ChallengeWheel` draws segments from the array; `useWheel` calculates angles using the category count. There is no need to rewrite the spin logic to reorder categories.
- For now each category has two short lines designed for the six-segment wheel. Long labels or substantially different category counts will need layout testing.
- Questions and answers are **not stored in the app yet**: the game deliberately uses the already printed cards. A future release can add typed `Question` objects and choose a random question on-screen.

**Future direction:** load a validated event configuration from a local JSON file, server endpoint or admin screen, and later add questions/answers, game modes and event-specific branding. That is **not implemented in this release**; the configuration is TypeScript source code and requires a rebuild after edits.

## Why little HTML and CSS?

`index.html` is only the root element and Vite script. The UI lives in `.tsx` components, which GitHub recognizes as **TypeScript**. Tailwind utility classes handle layout, color, typography and responsiveness. `src/styles.css` only contains the Tailwind import, special fullscreen/tablet breakpoints, pseudo-elements for the pointer, background effects and keyframe animations.

The much longer 18 KB stylesheet from the earlier non-Tailwind version is **not used** by this project. Check that `src/styles.css` begins with `@import "tailwindcss";`. The previous standalone `offline-backup/index.html` is **intentionally not included** in this repository because it was an entire second application in one HTML file and artificially increased GitHub's HTML percentage. The former project archive can be retained separately as an emergency fallback.

`.gitignore` excludes `node_modules`, `dist` and temporary build files. Do not commit your generated `dist/` directory to the source branch unless you're deliberately publishing a dedicated deployment branch.

## Tablet / kiosk layout

- On typical landscape and portrait tablets the game is sized to **100dvh**, with screen-height-aware wheel dimensions.
- On large laptop/desktop screens with a mouse or trackpad, the result panel uses a balanced 510px minimum height with more breathing room, rather than stretching to the wheel height. A dedicated Tailwind `desktop:` variant isolates this from touch tablet layouts.
- On landscape touch tablets with the browser toolbar visible, the result panel is centered independently of the wheel and no longer stretches to fill all available height. The `touch-landscape:` variant enforces this on coarse-pointer displays.
- On especially short landscape viewports the category legend is hidden to prioritize the wheel and the selected challenge; the tablet panel can shrink to a comfortable 290px minimum height so it does not look empty.
- On phones, vertical scrolling is allowed so the game controls are not clipped.
- Use the header button for fullscreen. Space also spins the wheel when focus is not on a form control.
- The wheel respects the operating system's reduced-motion preference.

## Deploy using Caddy

Build the project:

```bash
npm install
npm run build
sudo mkdir -p /srv/www/gdg-wheel
sudo cp -a dist/. /srv/www/gdg-wheel/
```

Basic Caddy configuration:

```caddyfile
wheel.example.com {
    root * /srv/www/gdg-wheel
    encode zstd gzip
    try_files {path} /index.html
    file_server
}
```

Substitute your own hostname and deploy through your existing reverse-proxy / tunnel setup.

### Event-day offline fallback

`dist/` is a static application that needs an HTTP server (do not double-click `dist/index.html` from `file://`):

```bash
npm run build
cd dist
python3 -m http.server 8080 --bind 127.0.0.1
```

Then open `http://localhost:8080` on the laptop. Once the build exists, this needs no internet connection or npm registry. For access from a separate tablet, serve on a trusted local network and use the laptop's LAN address; don't publicly expose the development server.

**Note:** This is not yet a PWA/service-worker cache. Opening the remote hosted URL for the first time still requires a network connection. Keep an offline copy of the built assets and use a local HTTP server for reliability.

## Testing

The spin math has unit tests (`npm run test`). The Tailwind migration was also checked against Tailwind v4.1.10's compiler and visually inspected using a static DOM-rendering harness at common tablet resolutions. The full Vite install/build needs to be run on your computer because the package registry was inaccessible in the creation environment.

## Attribution

Developed for the GDG on Campus University of Primorska chapter. This starter project does not include a third-party brand font, downloaded graphics, or a software license; choose a license before publishing it for public reuse.

## Latest layout adjustment (2026-10-09)

This revision changes only layout-related Tailwind classes in `src/App.tsx`, `src/components/ChallengePanel.tsx`, and the custom variant in `src/styles.css`:

- `desktop:min-h-[510px]` restores a little room between the result, category legend, and spin button on laptops.
- `touch-landscape:items-center` vertically centers the panel when Android Chrome's toolbar shortens the viewport.
- `touch-landscape:h-auto touch-landscape:min-h-[min(290px,100%)]` prevents the large empty space inside the tablet panel without changing the wheel size.

No category names, game logic or animations were changed.
