/**
 * Mutable, non-React store for the pinned hero → brown → yellow story.
 * GSAP writes `progress`; the WebGL scene reads it every frame. Keeping it
 * outside React avoids a re-render per scroll tick.
 */
export const story = {
  /** 0 → 1 across the pinned story wrapper */
  progress: 0,
  /** normalised pointer, -1 → 1 */
  pointerX: 0,
  pointerY: 0,
};

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Map `v` from [a, b] to [0, 1], clamped. */
export const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));

export const smooth = (t: number) => t * t * (3 - 2 * t);

export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Story beats, as fractions of the pinned scroll distance.
 * Shared by the DOM timeline and the 3D choreography so they stay in lockstep.
 */
export const BEATS = {
  heroEnd: 0.16, // coconut starts opening, headline leaves
  brownIn: [0.24, 0.38] as const, // scalloped brown wave rises
  cartonIn: [0.32, 0.5] as const, // coconut splits away, carton rises
  sipping: [0.38, 0.52] as const, // KEEP SIPPING reveal
  yellowIn: [0.62, 0.74] as const, // yellow wave rises
  palmo: [0.7, 0.86] as const, // PALMO wordmark reveal
};
