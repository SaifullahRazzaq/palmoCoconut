import type { Variant } from "./products";

/** Carton proportions in world units — shared by 3D geometry and 2D art. */
export const CARTON = { w: 1, h: 2.1, d: 0.62 };
/** Texture pixels per world unit. */
const PPU = 512;

export type Face = "front" | "back" | "side" | "sideAlt" | "top" | "bottom";

function cssFont(variable: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return v ? `${v}, ${fallback}` : fallback;
}

const fonts = () => ({
  display: cssFont("--font-anton", "Impact, sans-serif"),
  sans: cssFont("--font-manrope", "system-ui, sans-serif"),
  serif: cssFont("--font-instrument", "Georgia, serif"),
});

export function faceSize(face: Face) {
  const { w, h, d } = CARTON;
  switch (face) {
    case "front":
    case "back":
      return [w * PPU, h * PPU];
    case "side":
    case "sideAlt":
      return [d * PPU, h * PPU];
    default:
      return [w * PPU, d * PPU];
  }
}

/** A row of semicircles — the scalloped motif used throughout the brand. */
export function scallopPath(
  ctx: CanvasRenderingContext2D,
  y: number,
  width: number,
  r: number,
  up: boolean,
  bottom: number,
) {
  const n = Math.ceil(width / (r * 2)) + 1;
  ctx.beginPath();
  ctx.moveTo(-r, bottom);
  ctx.lineTo(-r, y);
  for (let i = 0; i < n; i++) {
    const cx = i * r * 2;
    ctx.arc(cx, y, r, Math.PI, 0, !up);
  }
  ctx.lineTo(n * r * 2, bottom);
  ctx.closePath();
}

function drawCoconutMark(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, v: Variant) {
  ctx.save();
  // Scalloped husk rim
  const bumps = 22;
  ctx.beginPath();
  for (let i = 0; i <= bumps * 8; i++) {
    const a = (i / (bumps * 8)) * Math.PI * 2;
    const rr = r * (1 + 0.035 * Math.cos(a * bumps));
    ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
  }
  ctx.fillStyle = v.body === "#3b2415" ? "#6e4527" : "#3b2415";
  ctx.fill();
  // Flesh
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2);
  ctx.fillStyle = "#fbfaf6";
  ctx.fill();
  // Water
  const g = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.05, cx, cy, r * 0.62);
  g.addColorStop(0, "#fff7d6");
  g.addColorStop(1, "#ffd21a");
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.58, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  // Straw
  ctx.translate(cx + r * 0.1, cy - r * 0.1);
  ctx.rotate(0.55);
  ctx.fillStyle = "#3b2415";
  ctx.fillRect(-r * 0.05, -r * 1.25, r * 0.1, r * 1.1);
  ctx.restore();
}

function drawFront(ctx: CanvasRenderingContext2D, W: number, H: number, v: Variant) {
  const f = fonts();
  ctx.fillStyle = v.body;
  ctx.fillRect(0, 0, W, H);

  // Top eyebrow
  ctx.fillStyle = v.ink;
  ctx.textAlign = "center";
  ctx.font = `700 ${W * 0.036}px ${f.sans}`;
  ctx.letterSpacing = `${W * 0.008}px`;
  ctx.fillText("NAM HOM · RATCHABURI · TH", W / 2, H * 0.06);
  ctx.letterSpacing = "0px";

  // Wordmark
  ctx.font = `${W * 0.38}px ${f.display}`;
  ctx.fillText("PALMO", W / 2, H * 0.245);

  ctx.font = `italic ${W * 0.075}px ${f.serif}`;
  ctx.fillText("the real source of every sip", W / 2, H * 0.3);

  // Coconut mark
  drawCoconutMark(ctx, W / 2, H * 0.49, W * 0.24, v);

  // Product name
  ctx.font = `${W * 0.13}px ${f.display}`;
  ctx.fillText("COCONUT WATER", W / 2, H * 0.72);
  ctx.font = `700 ${W * 0.045}px ${f.sans}`;
  ctx.letterSpacing = `${W * 0.01}px`;
  ctx.fillText(v.name.toUpperCase(), W / 2, H * 0.765);
  ctx.letterSpacing = "0px";

  // Scalloped bottom band
  ctx.fillStyle = v.accent;
  scallopPath(ctx, H * 0.83, W, W * 0.045, true, H);
  ctx.fill();
  ctx.fillStyle = v.accent === "#fbfaf6" || v.accent === "#ffd21a" ? "#3b2415" : "#fbfaf6";
  ctx.font = `700 ${W * 0.042}px ${f.sans}`;
  ctx.textAlign = "left";
  ctx.fillText("100% NATURAL", W * 0.08, H * 0.93);
  ctx.textAlign = "right";
  ctx.fillText(v.size.toUpperCase(), W * 0.92, H * 0.93);
}

function drawSide(ctx: CanvasRenderingContext2D, W: number, H: number, v: Variant, alt: boolean) {
  const f = fonts();
  ctx.fillStyle = v.body;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = v.accent;
  scallopPath(ctx, H * 0.83, W, W * 0.072, true, H);
  ctx.fill();

  ctx.save();
  ctx.translate(W * 0.5, H * 0.42);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = v.ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (alt) {
    ctx.font = `${W * 0.36}px ${f.display}`;
    ctx.fillText("KEEP SIPPING.", 0, 0);
  } else {
    ctx.font = `${W * 0.22}px ${f.display}`;
    ctx.fillText("ONE COCONUT", 0, -W * 0.13);
    ctx.font = `italic ${W * 0.16}px ${f.serif}`;
    ctx.fillText("one carton, nothing else", 0, W * 0.12);
  }
  ctx.restore();
}

function drawBack(ctx: CanvasRenderingContext2D, W: number, H: number, v: Variant) {
  const f = fonts();
  ctx.fillStyle = v.body;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = v.ink;
  ctx.textAlign = "left";
  const x = W * 0.09;
  ctx.font = `${W * 0.14}px ${f.display}`;
  ctx.fillText("NUTRITION", x, H * 0.1);
  ctx.font = `600 ${W * 0.034}px ${f.sans}`;
  ctx.fillText("PER 330 ML CARTON", x, H * 0.135);

  let y = H * 0.18;
  ctx.strokeStyle = v.ink;
  ctx.lineWidth = 2;
  for (const row of v.nutrition) {
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(W - x, y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.font = `600 ${W * 0.045}px ${f.sans}`;
    ctx.textAlign = "left";
    ctx.fillText(row.label, x, y + W * 0.075);
    ctx.textAlign = "right";
    ctx.fillText(row.value, W - x, y + W * 0.075);
    y += W * 0.11;
  }

  ctx.textAlign = "left";
  ctx.font = `${W * 0.1}px ${f.display}`;
  ctx.fillText("INGREDIENTS", x, H * 0.52);
  ctx.font = `500 ${W * 0.042}px ${f.sans}`;
  v.ingredients.forEach((ing, i) => ctx.fillText(ing.name, x, H * 0.56 + i * W * 0.065));

  // Barcode
  const bx = x;
  const by = H * 0.68;
  ctx.fillStyle = "#fbfaf6";
  ctx.fillRect(bx, by, W * 0.42, W * 0.24);
  ctx.fillStyle = "#140d08";
  let cx = bx + W * 0.03;
  let seed = 7;
  while (cx < bx + W * 0.39) {
    seed = (seed * 9301 + 49297) % 233280;
    const bw = 1 + (seed % 5);
    ctx.fillRect(cx, by + W * 0.03, bw, W * 0.16);
    cx += bw + 2 + (seed % 3);
  }

  ctx.fillStyle = v.accent;
  scallopPath(ctx, H * 0.83, W, W * 0.045, true, H);
  ctx.fill();
}

function drawCap(ctx: CanvasRenderingContext2D, W: number, H: number, v: Variant) {
  ctx.fillStyle = v.body;
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = v.ink;
  for (let i = 0; i < 6; i++) ctx.fillRect(0, (H / 6) * i, W, 2);
  ctx.globalAlpha = 1;
}

function paint(ctx: CanvasRenderingContext2D, face: Face, v: Variant, W: number, H: number) {
  if (face === "front") drawFront(ctx, W, H, v);
  else if (face === "back") drawBack(ctx, W, H, v);
  else if (face === "side") drawSide(ctx, W, H, v, false);
  else if (face === "sideAlt") drawSide(ctx, W, H, v, true);
  else drawCap(ctx, W, H, v);
}

/** Paint one carton face into a fresh canvas. `scale` multiplies the base resolution. */
export function makeFaceCanvas(face: Face, v: Variant, scale = 1) {
  const [w, h] = faceSize(face);
  const c = document.createElement("canvas");
  c.width = Math.round(w * scale);
  c.height = Math.round(h * scale);
  const ctx = c.getContext("2d")!;
  ctx.scale(scale, scale);
  paint(ctx, face, v, w, h);
  return c;
}
