# GDG Challenge Wheel

A reusable, self-hostable challenge wheel for **GDG on Campus — University of Primorska**.

Current event: **ŠtartUP 2026**. Visitors spin a six-category wheel, draw a matching **physical challenge card**, complete it, and receive a stamp.

Built with **React 19, TypeScript, Vite 7, and Tailwind CSS v4**. No backend, database or external requests at runtime: the Inter Tight font and the cloud background are bundled into the build.

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
│   │   ├── ChallengeWheel.tsx     # Glass SVG ring, labels, pointer and logo spin button
│   │   ├── ChallengePanel.tsx     # Glass result card and spin button
│   │   ├── StepRail.tsx           # How-to-play steps (list on desktop, chips on phones)
│   │   ├── Header.tsx             # Logo, event badge, sound and fullscreen controls
│   │   ├── GdgLogo.tsx            # The GDG brackets mark as inline SVG
│   │   └── Confetti.tsx           # Celebration particles
│   ├── assets/clouds-*.webp       # Background photo (desktop and phone sizes)
│   ├── hooks/useWheel.ts          # Spin state and animation
│   ├── hooks/useSound.ts          # Optional Web Audio sound
│   ├── hooks/useSpinCount.ts      # Today's spin count on this device
│   ├── lib/wheelMath.ts           # Framework-independent wheel geometry
│   ├── lib/wheelMath.test.ts      # Wheel alignment tests
│   ├── styles.css                 # Tailwind import, theme colors, background, glass
│   ├── App.tsx                    # Composes the screen
│   └── main.tsx                   # React entrypoint
└── package.json
```

## Customization (hardcoded for now)

- Change the **chapter, university, event name and category list** in `src/config/event.ts`.
- Change **category names, wheel labels, confetti colors and instructions** in `src/data/categories.ts`.
- `ChallengeWheel` draws segments from the array; `useWheel` calculates angles using the category count. There is no need to rewrite the spin logic to reorder categories.
- For now each category has two short lines designed for the six-segment wheel. Long labels or substantially different category counts will need layout testing.
- Questions and answers are **not stored in the app yet**: the game deliberately uses the already printed cards. A future release can add typed `Question` objects and choose a random question on-screen.

**Future direction:** load a validated event configuration from a local JSON file, server endpoint or admin screen, and later add questions/answers, game modes and event-specific branding. That is **not implemented in this release**; the configuration is TypeScript source code and requires a rebuild after edits.

## Why little HTML and CSS?

`index.html` is only the root element and Vite script. The UI lives in `.tsx` components, which GitHub recognizes as **TypeScript**. Tailwind utility classes handle layout, color, typography and responsiveness. `src/styles.css` only contains the Tailwind and font imports, the theme colors, the cloud background, the shared `.glass` surface and the confetti animation.

The much longer 18 KB stylesheet from the earlier non-Tailwind version is **not used** by this project. Check that `src/styles.css` begins with `@import "tailwindcss";`. The previous standalone `offline-backup/index.html` is **intentionally not included** in this repository because it was an entire second application in one HTML file and artificially increased GitHub's HTML percentage. The former project archive can be retained separately as an emergency fallback.

`.gitignore` excludes `node_modules`, `dist` and temporary build files. Do not commit your generated `dist/` directory to the source branch unless you're deliberately publishing a dedicated deployment branch.

## Layout

- **Desktop and landscape tablets:** steps on the left, the wheel in the middle and the result card on the right, over a sea of clouds, with the large "SPIN. PLAY. LEARN TECH" headline along the bottom. A small pill counts today's spins on this device.
- **Phones and portrait tablets (900px wide or less):** one scrolling column — header with a menu for sound and fullscreen, the event badge, the steps as chips, the wheel, the result card and the headline.
- Tap the logo in the middle of the wheel or the blue button to spin. Space also spins when focus is not on a button.
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

Developed for the GDG on Campus University of Primorska chapter. Font: [Inter Tight](https://fonts.google.com/specimen/Inter+Tight) (SIL Open Font License), bundled through `@fontsource-variable/inter-tight`.

Background photo: [Nimbus clouds and blue calm sky](https://unsplash.com/photos/nimbus-clouds-and-blue-calm-sky-9BJRGlqoIUk) by [Pero Kalimero](https://unsplash.com/@pericakalimerica) on Unsplash, used under the [Unsplash License](https://unsplash.com/license).

The project has no software license yet; choose one before publishing it for public reuse.

---

Special thanks to @ilijachrchev