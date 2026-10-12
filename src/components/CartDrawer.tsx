"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useCart } from "./CartContext";
import { useLenis } from "./SmoothScroll";
import { CartonImage } from "./ui/CartonImage";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CartDrawer() {
  const { open, setOpen, lines, total, setQty } = useCart();
  const panel = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const reduced = useReducedMotion();

  // GSAP owns the panel transform from the first paint.
  useLayoutEffect(() => {
    gsap.set(panel.current, { xPercent: 105 });
  }, []);

  useEffect(() => {
    if (!panel.current || !shade.current) return;
    const d = reduced ? 0 : 0.7;
    if (open) {
      lenis?.stop();
      gsap.set([panel.current, shade.current], { visibility: "visible" });
      gsap.to(panel.current, { xPercent: 0, duration: d, ease: "expo.out" });
      gsap.to(shade.current, { opacity: 1, duration: d * 0.6 });
      panel.current.focus();
    } else {
      lenis?.start();
      gsap.to(panel.current, { xPercent: 105, duration: d * 0.8, ease: "expo.in" });
      gsap.to(shade.current, { opacity: 0, duration: d * 0.6, onComplete: () => gsap.set([panel.current, shade.current], { visibility: "hidden" }) });
    }
  }, [open, lenis, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  return (
    <>
      <div ref={shade} onClick={() => setOpen(false)} className="invisible fixed inset-0 z-[60] bg-ink/40 opacity-0" />
      <aside
        ref={panel}
        tabIndex={-1}
        aria-label="Cart"
        aria-hidden={!open}
        className="invisible fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-paper text-ink outline-none"
        data-lenis-prevent
      >
        <div className="flex items-center justify-between border-b border-ink/15 px-6 py-5">
          <p className="display text-4xl">Your cart</p>
          <button onClick={() => setOpen(false)} className="eyebrow">
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6">
          {lines.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-serif text-3xl italic">Nothing to sip yet.</p>
              <p className="mt-2 text-sm text-ink/60">Add a carton from the showcase or the shop.</p>
            </div>
          ) : (
            <ul>
              {lines.map((l) => (
                <li key={l.id} className="grid grid-cols-[44px_1fr_auto] items-center gap-4 border-b border-ink/10 py-5">
                  <CartonImage variant={l.variant} tilt={-18} />
                  <div>
                    <p className="display text-2xl">{l.variant.name}</p>
                    <div className="mt-2 flex items-center gap-3 text-sm">
                      <button onClick={() => setQty(l.id, l.qty - 1)} className="h-7 w-7 rounded-full border border-ink/30" aria-label="Decrease">
                        −
                      </button>
                      <span className="tabular-nums">{l.qty}</span>
                      <button onClick={() => setQty(l.id, l.qty + 1)} className="h-7 w-7 rounded-full border border-ink/30" aria-label="Increase">
                        +
                      </button>
                    </div>
                  </div>
                  <p className="tabular-nums">${(l.qty * l.variant.price).toFixed(2)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-ink/15 px-6 py-6">
          <div className="mb-4 flex items-baseline justify-between">
            <span className="eyebrow text-ink/60">Subtotal</span>
            <span className="display text-3xl tabular-nums">${total.toFixed(2)}</span>
          </div>
          <button disabled={!lines.length} className="eyebrow h-14 w-full rounded-full bg-sun text-ink transition-opacity disabled:opacity-40">
            Checkout
          </button>
          <p className="mt-3 text-center text-xs text-ink/50">Demo store — checkout is not connected.</p>
        </div>
      </aside>
    </>
  );
}
