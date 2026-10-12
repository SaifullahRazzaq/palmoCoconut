"use client";

import { useEffect, useRef } from "react";
import { CARTON, makeFaceCanvas } from "@/lib/cartonArt";
import type { Variant } from "@/lib/products";

function useFace(face: "front" | "side", v: Variant) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled || !ref.current) return;
      const c = makeFaceCanvas(face, v, 1.5);
      c.style.width = "100%";
      c.style.height = "100%";
      c.style.display = "block";
      ref.current.replaceChildren(c);
    });
    return () => {
      cancelled = true;
    };
  }, [face, v]);
  return ref;
}

/**
 * CSS-3D carton (front + side) built from the same artwork as the WebGL model.
 * Used for product cards and as the no-WebGL / reduced-motion fallback.
 */
export function CartonImage({ variant, className = "", tilt = -24 }: { variant: Variant; className?: string; tilt?: number }) {
  const front = useFace("front", variant);
  const side = useFace("side", variant);
  const depthRatio = CARTON.d / CARTON.w;

  return (
    <div className={`relative [perspective:1400px] ${className}`} style={{ aspectRatio: `${CARTON.w} / ${CARTON.h}` }}>
      <div
        className="carton-3d absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] [transform-style:preserve-3d]"
        style={{ transform: `rotateY(var(--carton-tilt, ${tilt}deg)) rotateX(4deg)` }}
      >
        <div ref={front} className="absolute inset-0 bg-cream shadow-[0_40px_60px_-30px_rgba(20,13,8,.45)]" />
        <div
          ref={side}
          className="absolute top-0 h-full bg-cream brightness-[.82]"
          style={{
            width: `${depthRatio * 100}%`,
            left: "100%",
            transformOrigin: "left center",
            transform: "rotateY(90deg)",
          }}
        />
      </div>
    </div>
  );
}
