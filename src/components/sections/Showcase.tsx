"use client";

/* ADDITIONAL SECTION — not in the reference video. Interactive product viewer:
   drag to rotate, preset packaging views, variant switching, ingredients and nutrition. */

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { VARIANTS } from "@/lib/products";
import { SHOW_VARIANT } from "@/lib/events";
import { useGsap } from "@/hooks/useGsap";
import { useNavTheme } from "@/hooks/useNavTheme";
import { useInView } from "@/hooks/useInView";
import { useWebGL } from "@/hooks/useWebGL";
import { useFontsReady } from "@/hooks/useFontsReady";
import { Scallop } from "@/components/ui/Scallop";
import { CartonImage } from "@/components/ui/CartonImage";
import { useCart } from "@/components/CartContext";
import type { Control } from "@/components/three/ShowcaseCanvas";

const ShowcaseCanvas = dynamic(() => import("@/components/three/ShowcaseCanvas"), { ssr: false });

const VIEWS = [
  { label: "Front", angle: 0 },
  { label: "Side", angle: -Math.PI / 2 },
  { label: "Back", angle: Math.PI },
  { label: "Story", angle: Math.PI / 2 },
];

export function Showcase() {
  const root = useRef<HTMLElement>(null);
  useNavTheme(root, "light");
  const stageRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState<"ingredients" | "nutrition">("ingredients");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const controlRef = useRef<Control>({ rotY: -0.4, rotX: 0, velocity: 0.25, dragging: false, target: null });
  const drag = useRef({ x: 0, y: 0, lastT: 0 });
  const webgl = useWebGL();
  const fontsReady = useFontsReady();
  const inView = useInView(stageRef);
  const { add, setOpen } = useCart();
  const variant = VARIANTS[index];

  const reduced = useGsap(root, (q) => {
    gsap.from(q(".sc-title .word"), {
      yPercent: 110,
      stagger: 0.08,
      duration: 1.2,
      ease: "expo.out",
      scrollTrigger: { trigger: root.current, start: "top 70%" },
    });
    gsap.from(q(".sc-stage"), {
      scale: 0.85,
      autoAlpha: 0,
      duration: 1.6,
      ease: "expo.out",
      scrollTrigger: { trigger: root.current, start: "top 60%" },
    });
  });

  // Requests from the collection section
  useEffect(() => {
    const onShow = (e: Event) => {
      const i = VARIANTS.findIndex((v) => v.id === (e as CustomEvent<string>).detail);
      if (i >= 0) setIndex(i);
    };
    window.addEventListener(SHOW_VARIANT, onShow);
    return () => window.removeEventListener(SHOW_VARIANT, onShow);
  }, []);

  // Detail copy transitions when the variant changes
  useEffect(() => {
    if (reduced || !detailRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".swap-in", { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, stagger: 0.05, duration: 0.8, ease: "expo.out" });
    }, detailRef);
    return () => ctx.revert();
  }, [index, tab, reduced]);

  const onPointerDown = (e: React.PointerEvent) => {
    const control = controlRef.current;
    (e.target as Element).setPointerCapture(e.pointerId);
    control.dragging = true;
    control.target = null;
    drag.current = { x: e.clientX, y: e.clientY, lastT: performance.now() };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const control = controlRef.current;
    if (!control.dragging) return;
    const now = performance.now();
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    const dt = Math.max(1, now - drag.current.lastT) / 1000;
    control.rotY += dx * 0.01;
    control.rotX = Math.max(-0.5, Math.min(0.5, control.rotX + dy * 0.004));
    control.velocity = (dx * 0.01) / dt;
    drag.current = { x: e.clientX, y: e.clientY, lastT: now };
  };
  const onPointerUp = () => {
    const control = controlRef.current;
    control.dragging = false;
    control.velocity = Math.max(-8, Math.min(8, control.velocity));
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const control = controlRef.current;
    if (e.key === "ArrowLeft") control.rotY -= 0.3;
    if (e.key === "ArrowRight") control.rotY += 0.3;
  };

  const addToCart = () => {
    add(variant.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const cycle = (dir: number) => setIndex((i) => (i + dir + VARIANTS.length) % VARIANTS.length);

  return (
    <section ref={root} id="showcase" className="relative z-10 bg-husk text-paper">
      <Scallop color="#6e4527" size="clamp(56px, 7vw, 120px)" />
      <div className="grid min-h-svh gap-8 px-[4vw] py-[12vh] lg:grid-cols-[1.15fr_1fr] lg:items-center">
        {/* Stage */}
        <div ref={stageRef} className="relative">
          <div className="mb-4 flex items-center justify-between">
            <span className="eyebrow text-paper/60">(07) — Showcase</span>
            <span className="eyebrow text-paper/60">Drag to rotate</span>
          </div>
          <div
            className="sc-stage relative aspect-square max-h-[74vh] w-full cursor-grab touch-pan-y select-none outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-sun"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
            tabIndex={0}
            role="img"
            aria-label={`${variant.name} carton — drag or use arrow keys to rotate`}
          >
            <div
              className="absolute left-1/2 top-1/2 aspect-square w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-700"
              style={{ background: variant.id === "cacao" || variant.id === "sparkling" ? "#ffd21a" : "#8a5a36" }}
            />
            {webgl === false ? (
              <div className="absolute inset-0 grid place-items-center">
                <CartonImage variant={variant} className="w-[34%]" />
              </div>
            ) : (
              webgl && fontsReady && <ShowcaseCanvas variant={variant} controlRef={controlRef} active={inView} still={reduced} />
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {VIEWS.map((v) => (
              <button
                key={v.label}
                onClick={() => (controlRef.current.target = v.angle)}
                className="eyebrow rounded-full border border-paper/30 px-4 py-2 transition-colors hover:border-sun hover:bg-sun hover:text-ink"
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div ref={detailRef}>
          <h2 className="sc-title display mb-8 text-[clamp(3rem,6vw,6.4rem)]">
            <span className="inline-block overflow-hidden align-top">
              <span className="word inline-block">Turn it</span>
            </span>{" "}
            <span className="inline-block overflow-hidden align-top">
              <span className="word inline-block text-sun">over</span>
            </span>
          </h2>

          <div role="tablist" aria-label="Variants" className="mb-8 grid grid-cols-4 border-y border-paper/20">
            {VARIANTS.map((v, i) => (
              <button
                key={v.id}
                role="tab"
                aria-selected={i === index}
                onClick={() => setIndex(i)}
                className={`relative py-4 text-left text-sm font-semibold transition-colors ${i === index ? "text-sun" : "text-paper/60 hover:text-paper"}`}
              >
                <span className="mr-2 hidden h-2.5 w-2.5 rounded-full sm:inline-block border border-paper/40" style={{ background: v.body }} />
                <span className="text-xs sm:text-sm">{v.name}</span>
                <span
                  className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-sun transition-transform duration-500"
                  style={{ transform: `scaleX(${i === index ? 1 : 0})` }}
                />
              </button>
            ))}
          </div>

          <div className="overflow-hidden">
            <div key={variant.id + "-head"} className="flex items-end justify-between gap-6">
              <div>
                <p className="swap-in display text-[clamp(2.6rem,4.4vw,4.4rem)]">{variant.name}</p>
                <p className="swap-in mt-1 font-serif text-2xl italic text-paper/80">{variant.tagline}</p>
              </div>
              <p className="swap-in display text-[clamp(2rem,3vw,3rem)]">${variant.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-8 flex gap-6 border-b border-paper/20" role="tablist" aria-label="Details">
            {(["ingredients", "nutrition"] as const).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`eyebrow -mb-px border-b-2 pb-3 transition-colors ${tab === t ? "border-sun text-paper" : "border-transparent text-paper/50 hover:text-paper"}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="min-h-[15.5rem] py-6" key={variant.id + tab}>
            {tab === "ingredients" ? (
              <ul className="space-y-4">
                {variant.ingredients.map((ing) => (
                  <li key={ing.name} className="swap-in flex items-baseline justify-between gap-6 border-b border-paper/10 pb-4">
                    <span className="font-serif text-2xl italic">{ing.name}</span>
                    <span className="eyebrow text-right text-paper/60">{ing.note}</span>
                  </li>
                ))}
                <li className="swap-in pt-2 text-sm text-paper/60">
                  Never from concentrate · Not heat treated · BPA-free, plant-based cap
                </li>
              </ul>
            ) : (
              <ul className="space-y-3.5">
                <li className="eyebrow swap-in flex justify-between text-paper/50">
                  <span>Per carton ({variant.size})</span>
                  <span>% RI</span>
                </li>
                {variant.nutrition.map((n) => (
                  <li key={n.label} className="swap-in">
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span>{n.label}</span>
                      <span className="tabular-nums">
                        {n.value} <span className="ml-3 text-paper/50">{n.pct}%</span>
                      </span>
                    </div>
                    <div className="h-1 overflow-hidden bg-paper/15">
                      <div className="h-full bg-sun" style={{ width: `${Math.min(100, (n.pct ?? 0) * 2.5)}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-paper/30">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-12 w-12 text-xl" aria-label="Decrease quantity">
                −
              </button>
              <span className="w-8 text-center tabular-nums" aria-live="polite">
                {qty}
              </span>
              <button onClick={() => setQty((q) => Math.min(48, q + 1))} className="h-12 w-12 text-xl" aria-label="Increase quantity">
                +
              </button>
            </div>
            <button
              onClick={addToCart}
              className="eyebrow h-12 flex-1 rounded-full bg-sun px-8 text-ink transition-transform hover:scale-[1.02] active:scale-95"
            >
              {added ? "Added ✓" : `Add to cart — $${(variant.price * qty).toFixed(2)}`}
            </button>
            <button onClick={() => setOpen(true)} className="eyebrow underline underline-offset-4">
              View cart
            </button>
          </div>

          <div className="mt-8 flex gap-3">
            <button onClick={() => cycle(-1)} className="eyebrow text-paper/60 hover:text-paper" aria-label="Previous variant">
              ← Prev
            </button>
            <span className="text-paper/30">/</span>
            <button onClick={() => cycle(1)} className="eyebrow text-paper/60 hover:text-paper" aria-label="Next variant">
              Next →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
