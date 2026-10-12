import * as THREE from "three";

/** Deterministic PRNG so the coconut looks identical on every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SHELL_TONES = ["#1f1109", "#2e1a0d", "#452815", "#5c3920", "#77502f", "#936a43", "#b08658"];

/**
 * Equirectangular husk texture: mottled base + thousands of meridian-aligned
 * fibres. Returned as colour map plus a matching bump/roughness source.
 */
export function createShellTextures(size = 2048) {
  const rand = mulberry32(42);
  const W = size;
  const H = size / 2;

  const color = document.createElement("canvas");
  color.width = W;
  color.height = H;
  const c = color.getContext("2d")!;

  const bump = document.createElement("canvas");
  bump.width = W;
  bump.height = H;
  const b = bump.getContext("2d")!;

  c.fillStyle = "#3d2413";
  c.fillRect(0, 0, W, H);
  b.fillStyle = "#555";
  b.fillRect(0, 0, W, H);

  // Mottling — large soft blots
  for (let i = 0; i < 260; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const r = 20 + rand() * 140;
    const tone = SHELL_TONES[Math.floor(rand() * SHELL_TONES.length)];
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, tone + "66");
    g.addColorStop(1, tone + "00");
    c.fillStyle = g;
    c.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // Fibres
  c.lineCap = "round";
  b.lineCap = "round";
  const fibres = Math.round(size * 9);
  for (let i = 0; i < fibres; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const len = 6 + rand() * rand() * 70;
    const angle = Math.PI / 2 + (rand() - 0.5) * 0.9;
    const bend = (rand() - 0.5) * len * 0.5;
    const dx = Math.cos(angle) * len;
    const dy = Math.sin(angle) * len;
    const toneIdx = Math.floor(rand() * SHELL_TONES.length);
    const lw = 0.5 + rand() * 2.2;

    c.strokeStyle = SHELL_TONES[toneIdx];
    c.globalAlpha = 0.25 + rand() * 0.6;
    c.lineWidth = lw;
    c.beginPath();
    c.moveTo(x, y);
    c.quadraticCurveTo(x + dx / 2 + bend, y + dy / 2, x + dx, y + dy);
    c.stroke();

    const lum = Math.round(40 + (toneIdx / (SHELL_TONES.length - 1)) * 200);
    b.strokeStyle = `rgb(${lum},${lum},${lum})`;
    b.globalAlpha = 0.5;
    b.lineWidth = lw;
    b.beginPath();
    b.moveTo(x, y);
    b.quadraticCurveTo(x + dx / 2 + bend, y + dy / 2, x + dx, y + dy);
    b.stroke();
  }
  c.globalAlpha = 1;
  b.globalAlpha = 1;

  const map = new THREE.CanvasTexture(color);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.anisotropy = 8;
  const bumpMap = new THREE.CanvasTexture(bump);
  bumpMap.wrapS = THREE.RepeatWrapping;
  return { map, bumpMap };
}

/**
 * Planar texture for the cut face (RingGeometry UVs are planar):
 * husk → thin brown testa → thick white flesh with subtle radial grain.
 * Radii are in ring-UV space where 0.5 is the outer edge.
 */
export function createCutTexture(inner: number, size = 1024) {
  const rand = mulberry32(7);
  const cv = document.createElement("canvas");
  cv.width = size;
  cv.height = size;
  const ctx = cv.getContext("2d")!;
  const C = size / 2;
  const R = size / 2;

  // Husk band with radial fibres
  ctx.fillStyle = "#3a2211";
  ctx.beginPath();
  ctx.arc(C, C, R, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 5000; i++) {
    const a = rand() * Math.PI * 2;
    const r0 = R * (0.91 + rand() * 0.09);
    const r1 = r0 - R * (0.01 + rand() * 0.035);
    ctx.strokeStyle = SHELL_TONES[Math.floor(rand() * SHELL_TONES.length)];
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 0.6 + rand() * 1.4;
    ctx.beginPath();
    ctx.moveTo(C + Math.cos(a) * r0, C + Math.sin(a) * r0);
    ctx.lineTo(C + Math.cos(a) * r1, C + Math.sin(a) * r1);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Hard shell (endocarp) — dark ring
  ctx.fillStyle = "#24140a";
  ctx.beginPath();
  ctx.arc(C, C, R * 0.915, 0, Math.PI * 2);
  ctx.fill();

  // Testa
  ctx.fillStyle = "#7a5230";
  ctx.beginPath();
  ctx.arc(C, C, R * 0.875, 0, Math.PI * 2);
  ctx.fill();

  // Flesh
  const flesh = ctx.createRadialGradient(C, C, R * inner * 2, C, C, R * 0.86);
  flesh.addColorStop(0, "#fffdf6");
  flesh.addColorStop(0.7, "#f8f2e4");
  flesh.addColorStop(1, "#eadcc0");
  ctx.fillStyle = flesh;
  ctx.beginPath();
  ctx.arc(C, C, R * 0.86, 0, Math.PI * 2);
  ctx.fill();

  // Faint radial grain in the flesh
  for (let i = 0; i < 1400; i++) {
    const a = rand() * Math.PI * 2;
    const r0 = R * (inner * 2 + rand() * (0.85 - inner * 2));
    ctx.strokeStyle = "#d9c8a6";
    ctx.globalAlpha = 0.12;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(C + Math.cos(a) * r0, C + Math.sin(a) * r0);
    ctx.lineTo(C + Math.cos(a) * (r0 + R * 0.03), C + Math.sin(a) * (r0 + R * 0.03));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Soft radial blob used as a cheap, controllable contact shadow. */
export function createShadowTexture(size = 256) {
  const cv = document.createElement("canvas");
  cv.width = size;
  cv.height = size;
  const ctx = cv.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(20,13,8,0.55)");
  g.addColorStop(0.45, "rgba(20,13,8,0.22)");
  g.addColorStop(1, "rgba(20,13,8,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(cv);
}

export { mulberry32 };
