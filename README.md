# PALMO — premium coconut water

A single-page website for the PALMO brand with a scroll-driven 3D product story.
Built with Next.js (App Router), TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger, Lenis and React Three Fiber.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Sections

| # | Section | Source |
|---|---------|--------|
| 01–03 | Pinned story: white coconut hero → brown scalloped "KEEP SIPPING." → yellow PALMO reveal | From the brief's reference description |
| 04 | Product introduction | Added |
| 05 | Benefits (pinned horizontal scroll on desktop) | Added |
| 06 | Collection | Added |
| 07 | Interactive 3D showcase | Added |
| 08 | Brand story | Added |
| 09 | Ingredients & sourcing | Added |
| 10 | Shop + cart drawer | Added |
| — | Footer | Added |

## How the story works

- `src/components/story/StorySection.tsx` — a 620vh wrapper with a sticky stage. One scrubbed GSAP
  timeline drives the DOM layers (headline, scalloped panels, type reveals, organic shapes) and writes
  `story.progress` (`src/lib/story.ts`).
- `src/components/three/StoryCanvas.tsx` — reads that progress every frame and damps the coconut halves,
  carton and camera towards poses derived from the shared `BEATS`, so 3D and DOM stay in lockstep
  without React re-renders.

## Assets

There are no photos or model files. Everything is generated at runtime:

- Coconut (`three/Coconut.tsx`, `three/coconutTextures.ts`): displaced shell geometry, canvas-painted
  fibre colour/bump maps, loose husk strands, layered cut face and a moist inner surface.
- Carton (`three/Carton.tsx`, `lib/cartonArt.ts`): per-face canvas artwork per variant. The same
  artwork renders the CSS-3D cartons in cards and the fallbacks.

## Fallbacks

- `prefers-reduced-motion`: no smooth scroll, no pinning or scrubbing; the story renders as three
  static panels and every section shows its final state.
- No WebGL: an SVG coconut and CSS-3D cartons replace the canvases.
- The WebGL loops pause when their section is off-screen.
