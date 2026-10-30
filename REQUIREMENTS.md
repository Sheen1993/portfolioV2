# Requirements

Static single-page portfolio built with React, Vite, TypeScript, Tailwind, GSAP and Framer Motion. There is no backend, no API calls and no environment variables.

## System

| Requirement | Version | Notes |
|---|---|---|
| Node.js | `^20.19.0` or `>=22.12.0` | Floor set by Vite 8 and `@vitejs/plugin-react` 6 |
| npm | 10+ recommended | Use `npm ci` so installs match `package-lock.json` |

## Dependencies

All of these are installed from `package.json`. They're listed here for reference.

### Runtime

| Package | Version | Used for |
|---|---|---|
| `react`, `react-dom` | 18.3.1 | UI |
| `gsap` | ^3.15.0 | Scroll-pinned master timeline |
| `@gsap/react` | ^2.1.2 | `useGSAP` hook |
| `framer-motion` | 12.38.0 | Entrance animations in snap mode |
| `lucide-react` | ^1.48.0 | Icons |

### Build / dev

| Package | Version |
|---|---|
| `vite` | ^8.3.1 |
| `@vitejs/plugin-react` | ^6.1.1 |
| `typescript` | ^7.0.2 |
| `tailwindcss` | 3.4.1 |
| `postcss` | ^8.5.28 |
| `autoprefixer` | ^10.6.1 |
| `@types/react` | ^18.3.31 |
| `@types/react-dom` | ^18.3.7 |

## Setup

```bash
npm ci              # install exact locked versions
npm run dev         # dev server (exposed on the LAN via server.host)
npm run typecheck   # tsc --noEmit
npm run build       # typecheck, then build to dist/
npm run preview     # serve the built dist/ locally
```

## Deployment

`npm run build` writes static files to `dist/`. Any static host works, and you don't need server-side routing.

## Browser support

- An evergreen browser with ES2022 support.
- Network access to Google Fonts (Big Shoulders Display, IBM Plex Sans, IBM Plex Mono), which `index.html` loads.

The site picks a rendering mode from media queries in `src/lib/media.ts`:

| Mode | When | Behaviour |
|---|---|---|
| `pinned` | ≥768px wide, hover, fine pointer | GSAP scroll-scrubbed pinned stage. Custom cursor and magnetic hover at ≥1024px |
| `snap` | Touch devices and small screens | Full-screen scroll-snap with Framer Motion entrances |
| `static` | `prefers-reduced-motion: reduce` | Plain stacked page with opacity fades only |
