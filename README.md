# GDG on Campus UP - ŠtartUP 2026 Challenge Wheel

A polished, offline-first spinning wheel for GDG on Campus, University of Primorska. The categories match the **six printed challenge-card sets**:

1. Google & Tech (blue)
2. Cyber Smart (red)
3. Guess the Tech (green)
4. Debug It! (orange)
5. Tech Trivia (purple)
6. Wildcard (pink)

## Use it at the stand

1. Open `index.html` directly in Chrome, Chromium, Firefox, or Edge on your laptop — **no internet required**.
2. Click the fullscreen button (top right), or press **F11** in your browser.
3. Ask the student to press **SPIN**, or press **Space** yourself.
4. When the wheel stops, let them draw a card from the matching category.
5. Help them with the question and give them the ŠtartUP stamp.

**Tip:** Leave your tablet displaying your GDG registration/follow QR code. The wheel doesn't need the tablet or a second service.

## Self-host (Caddy)

Copy `index.html` to a folder that your web server can serve, such as `/var/www/gdg-wheel/index.html`.

Minimal Caddyfile example for a **new** site block (replace the domain with one you control):

```caddyfile
wheel.example.com {
    root * /var/www/gdg-wheel
    file_server
}
```

Use your existing Cloudflare Tunnel / reverse-proxy routing if desired. Do not expose your Caddy admin endpoint. If you only need the wheel at the event, **opening the local file is safer** than relying on the event Wi-Fi.

## Customize

All code is in `index.html`. Search for `const CATEGORIES` in the bottom `<script>` section. You can edit each category's `name`, `lines` (text drawn on the wheel), `color`, `icon`, and `description`.

There are **no dependencies**, fonts to install, remote scripts, tracking, data collection, or required backend. Winner selection is uniform random across categories and includes slight visual variation while staying within the winning slice. Animations honor the system's reduced-motion preference. Sound is **off by default**.

## Files

- `index.html`: complete standalone webpage
- `README.md`: these instructions

For later events, simply change the text and categories; the design is reusable.
