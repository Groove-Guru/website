<p align="center">
  <img src="assets/readme-banner.png" alt="groove guru. hear your mix before the room does." width="100%">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HARNESS-IN%20DEVELOPMENT-FF4A2B?style=flat-square&labelColor=0B0B0B" alt="Harness: in development">
  <img src="https://img.shields.io/badge/PAGES-1-F2F0EA?style=flat-square&labelColor=0B0B0B" alt="Pages: 1">
  <img src="https://img.shields.io/badge/STACK-VANILLA%20JS-F2F0EA?style=flat-square&labelColor=0B0B0B" alt="Stack: vanilla JS">
  <img src="https://img.shields.io/badge/BUILD%20STEP-NONE-F2F0EA?style=flat-square&labelColor=0B0B0B" alt="Build step: none">
  <img src="https://img.shields.io/badge/DEPENDENCIES-ZERO-F2F0EA?style=flat-square&labelColor=0B0B0B" alt="Dependencies: zero">
  <img src="https://img.shields.io/badge/DEPLOY-CLOUDFLARE%20PAGES-F2F0EA?style=flat-square&labelColor=0B0B0B" alt="Deploy: Cloudflare Pages">
</p>

---

# The site

The marketing site for **Groove Guru**, a DJ tutor that listens to Pioneer Pro DJ
Link gear on the booth LAN and coaches key, phrase and timing. One page, one
stylesheet, one script, served by Cloudflare Pages. No framework, no bundler, no
build step, no runtime dependency. It was designed in Claude Design and ported
as-is; the stack follows plan §19 in
[`Groove-Guru/groove-guru`](https://github.com/Groove-Guru/groove-guru).

## The rule this site is built around

Nothing is released yet. The drill previews on the page are real and run in the
browser; the booth harness, the coach and Pro are being built. So:

- The harness is labelled **in development**. The install block shows the
  planned command (`groove-harness --iface en0`), not a working one.
- Pro shows its launch price, marked **at launch**.
- The iPad/iPhone companion is **planned**.
- "Get the harness" links to the GitHub organisation, because the harness
  repository is private until it is released.

When something ships, change its label in `index.html` and `llms.txt` together.

## Files

| Path | What it is |
| :--- | :--- |
| `index.html` | The page: hero, 01 floor, 02 zero-to-booth drills, 03 coach, 04 Camelot wheel, 05 wire, 06 get in |
| `assets/groove.css`, `assets/groove.js` | The one stylesheet and the one script. The page reads fine with JS off |
| `404.html` | Cloudflare Pages serves it for unknown paths, so they return 404 instead of the home page with 200 |
| `llms.txt`, `robots.txt`, `sitemap.xml` | Machine-readable summary, crawler rules, sitemap |
| `_headers`, `_redirects` | Security and cache headers; `/github` and `/source` short links |

## Brand assets

| File | Use |
| :--- | :--- |
| `assets/favicon.svg` | The mark: a platter with the groove line cut through it. Off-white `#f2f0ea`, transparent |
| `assets/logo-mark.svg` | The mark on a club-black tile. Source for the app icons |
| `assets/logo.svg`, `assets/logo.png` | Horizontal lockup, "groove guru". The PNG uses the real Instrument Sans and a transparent background; the SVG falls back to system fonts |
| `assets/icon-512.png`, `assets/apple-touch-icon.png` | App and home-screen icons |
| `assets/og.png` | Open Graph and Twitter card, 1200×630 |
| `assets/readme-banner.png`, `assets/org-avatar.png` | GitHub only: this README and the organisation profile. Not published on the site |

The raster files come from the HTML sources in `tools/`. After changing a source, run:

```sh
tools/render-og.sh   # headless Chrome; writes every PNG above
```

Palette ("concrete"): canvas `#0b0b0b`; ink `#f2f0ea` for the mark, text and
primary buttons; greys `#a19e97` and `#9d9a93`; lines `#2a2a2a` and `#3d3d3d`;
signal red `#ff4a2b` for warnings only. Square corners, film grain, no glow.
Type: Instrument Sans and JetBrains Mono.

## Develop

```sh
python3 -m http.server 8787   # serve the repository root; there is nothing to build
```

## Deploy

Merging to `main` publishes nothing: the Pages project `groove-guru` (Factory0
Cloudflare account) is direct-upload. Deploy with:

```sh
tools/deploy.sh             # builds origin/main in a throwaway worktree and deploys it
tools/deploy.sh --dry-run   # builds it and says what would ship
```

Never run `tools/build-dist.sh && wrangler pages deploy dist` from a working
copy. More than one agent session can share a checkout, and that ships whatever
the working copy holds. `build-dist.sh` is an explicit allowlist and stamps
content hashes onto the CSS and JS URLs so they can be cached immutably.

---

Pioneer DJ and Pro DJ Link are trademarks of their respective owners. Groove
Guru is an independent open-protocol project, not affiliated with or endorsed by
them.
