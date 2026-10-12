/** Hand-drawn-feeling organic shapes used across the yellow & brown scenes. */

// Round generated coordinates so server and client markup match exactly.
const f = (n: number) => Math.round(n * 100) / 100;

export function Frond({ className = "" }: { className?: string }) {
  // A palm frond: curved rachis with tapering leaflets on both sides.
  const leaflets = Array.from({ length: 13 }, (_, i) => {
    const t = (i + 1) / 14;
    const x = 40 + t * 300;
    const y = 360 - Math.sin(t * Math.PI * 0.9) * 210 - t * 60;
    const len = 150 * Math.sin(t * Math.PI) + 40;
    const a = -0.9 + t * 0.5;
    return { x: f(x), y: f(y), len: f(len), a };
  });
  return (
    <svg viewBox="0 0 400 420" className={className} fill="currentColor" aria-hidden>
      <path d="M20 400 C 120 330, 220 180, 370 90" stroke="currentColor" strokeWidth="9" fill="none" strokeLinecap="round" />
      {leaflets.map(({ x, y, len, a }, i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path
            transform={`rotate(${f((a * 180) / Math.PI - 50)})`}
            d={`M0 0 C ${f(len * 0.3)} -16, ${f(len * 0.75)} -14, ${len} 0 C ${f(len * 0.75)} 8, ${f(len * 0.3)} 10, 0 0Z`}
          />
          <path
            transform={`rotate(${f((a * 180) / Math.PI + 70)})`}
            d={`M0 0 C ${f(len * 0.3)} -12, ${f(len * 0.75)} -10, ${f(len * 0.9)} 0 C ${f(len * 0.7)} 8, ${f(len * 0.3)} 9, 0 0Z`}
          />
        </g>
      ))}
    </svg>
  );
}

export function Blob({ className = "" }: { className?: string }) {
  // Scalloped rosette — a cut coconut seen from above, simplified.
  const n = 12;
  const R = 90;
  const r = 24;
  let d = "";
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 1) / n) * Math.PI * 2;
    const x0 = 100 + Math.cos(a0) * R;
    const y0 = 100 + Math.sin(a0) * R;
    const x1 = 100 + Math.cos(a1) * R;
    const y1 = 100 + Math.sin(a1) * R;
    d += `${i === 0 ? `M${f(x0)} ${f(y0)}` : ""} A ${r} ${r} 0 0 1 ${f(x1)} ${f(y1)}`;
  }
  return (
    <svg viewBox="-10 -10 220 220" className={className} aria-hidden>
      <path d={d + "Z"} fill="currentColor" />
      <circle cx="100" cy="100" r="46" fill="#ffd21a" />
      <circle cx="100" cy="100" r="18" fill="currentColor" />
    </svg>
  );
}

export function CoconutIllustration({ className = "" }: { className?: string }) {
  // Split coconut: brown husk, white flesh, used as SVG fallback and ornament.
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden>
      <defs>
        <radialGradient id="husk" cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#8a5a36" />
          <stop offset="1" stopColor="#2e1a0d" />
        </radialGradient>
        <radialGradient id="flesh" cx="45%" cy="40%" r="70%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#eadcc0" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="120" r="112" fill="url(#husk)" />
      <circle cx="120" cy="120" r="92" fill="#24140a" />
      <circle cx="120" cy="120" r="86" fill="url(#flesh)" />
      <circle cx="120" cy="120" r="58" fill="#f4ecdb" />
      <ellipse cx="102" cy="96" rx="22" ry="12" fill="#fff" opacity="0.7" />
    </svg>
  );
}
