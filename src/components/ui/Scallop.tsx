type Props = {
  color: string;
  /** Diameter of one scallop */
  size?: string;
  /** Horizontal phase shift, so stacked rows interlock */
  offset?: string;
  className?: string;
  /** Point the bumps downwards and hang the row below the panel */
  flip?: boolean;
};

// Enough circles to span a 2560px-wide screen at the smallest scallop size.
const COUNT = 60;

/**
 * A row of true semicircles glued to the edge of a panel of the same colour.
 * Built from clipped circles rather than a tiled background: Chromium leaves a
 * hairline at the edge of background tiles when the panel sits on a sub-pixel.
 */
export function Scallop({ color, size = "clamp(44px, 6vw, 96px)", offset = "0px", className = "", flip = false }: Props) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 flex overflow-hidden ${
        flip ? "top-[calc(100%-1px)] items-end" : "bottom-[calc(100%-1px)] items-start"
      } ${className}`}
      style={{ height: `calc(${size} / 2 + 1px)`, paddingLeft: `calc(${offset} - ${size})` }}
    >
      {Array.from({ length: COUNT }, (_, i) => (
        <span key={i} className="block shrink-0 rounded-full" style={{ width: size, height: size, background: color }} />
      ))}
    </div>
  );
}
