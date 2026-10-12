"use client";

/* ADDITIONAL SECTION — not in the reference video. Shop: single cartons and
   boxes, listed as an editorial price list rather than product cards. */

import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { VARIANTS } from "@/lib/products";
import { useCart } from "@/components/CartContext";
import { CartonImage } from "@/components/ui/CartonImage";

const PACKS = [
  { size: 1, label: "Single", save: 0 },
  { size: 12, label: "Box of 12", save: 0.1 },
  { size: 24, label: "Grove crate · 24", save: 0.18 },
];

export function Shop() {
  const root = useRef<HTMLElement>(null);
  const [pack, setPack] = useState(1);
  const [flash, setFlash] = useState<string | null>(null);
  const { add, setOpen } = useCart();
  const p = PACKS[pack];

  useGsap(root, (q) => {
    gsap.from(q(".shop-row"), {
      y: 40,
      autoAlpha: 0,
      stagger: 0.08,
      duration: 1,
      ease: "expo.out",
      scrollTrigger: { trigger: q(".shop-list")[0], start: "top 85%" },
    });
    gsap.from(q(".shop-title .word"), {
      yPercent: 110,
      duration: 1.2,
      stagger: 0.08,
      ease: "expo.out",
      scrollTrigger: { trigger: root.current, start: "top 75%" },
    });
  });

  const buy = (id: string) => {
    add(id, p.size);
    setFlash(id);
    setTimeout(() => setFlash(null), 1400);
  };

  return (
    <section ref={root} id="shop" className="bg-paper px-[4vw] py-[16vh] text-ink">
      <div className="mb-[8vh] grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <span className="eyebrow mb-6 block text-ink/50">(10) — Shop</span>
          <h2 className="shop-title display text-[clamp(3.6rem,10vw,11rem)]">
            <span className="inline-block overflow-hidden align-top">
              <span className="word inline-block">Stock</span>
            </span>{" "}
            <span className="inline-block overflow-hidden align-top">
              <span className="word inline-block">the</span>
            </span>{" "}
            <span className="inline-block overflow-hidden align-top">
              <span className="word inline-block text-husk">fridge</span>
            </span>
          </h2>
        </div>
        <div>
          <p className="eyebrow mb-3 text-ink/50">Pack size</p>
          <div className="grid grid-cols-3 border border-ink" role="radiogroup" aria-label="Pack size">
            {PACKS.map((pk, i) => (
              <button
                key={pk.label}
                role="radio"
                aria-checked={pack === i}
                onClick={() => setPack(i)}
                className={`px-2 py-3 text-center text-xs font-bold uppercase tracking-wider transition-colors sm:text-sm ${
                  pack === i ? "bg-ink text-paper" : "hover:bg-ink/5"
                } ${i > 0 ? "border-l border-ink" : ""}`}
              >
                {pk.label}
                {pk.save > 0 && <span className="block text-[0.65rem] text-sun-deep">save {Math.round(pk.save * 100)}%</span>}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-ink/60">Free delivery over $40 · Recyclable, plant-based cartons</p>
        </div>
      </div>

      <ul className="shop-list border-t border-ink">
        {VARIANTS.map((v) => {
          const price = v.price * p.size * (1 - p.save);
          return (
            <li key={v.id} className="shop-row group grid grid-cols-[56px_1fr_auto] items-center gap-4 border-b border-ink/20 py-5 sm:grid-cols-[80px_1.2fr_1fr_auto_auto] sm:gap-8">
              <div className="w-10 sm:w-12">
                <CartonImage variant={v} tilt={-18} />
              </div>
              <div>
                <h3 className="display text-[clamp(2rem,3.6vw,3.6rem)] transition-transform duration-500 group-hover:translate-x-2">{v.name}</h3>
                <p className="text-sm text-ink/60 sm:hidden">{v.flavor}</p>
              </div>
              <p className="hidden text-ink/65 sm:block">{v.flavor}</p>
              <p className="display hidden text-[clamp(1.6rem,2.4vw,2.4rem)] tabular-nums sm:block">${price.toFixed(2)}</p>
              <button
                onClick={() => buy(v.id)}
                className={`eyebrow col-start-3 row-start-1 whitespace-nowrap rounded-full border px-5 py-3 transition-colors sm:col-auto sm:row-auto ${
                  flash === v.id ? "border-sun bg-sun text-ink" : "border-ink hover:bg-ink hover:text-paper"
                }`}
              >
                {flash === v.id ? "Added ✓" : <>Add <span className="sm:hidden">· ${price.toFixed(2)}</span></>}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 flex justify-end">
        <button onClick={() => setOpen(true)} className="eyebrow flex items-center gap-3 border-b border-ink pb-1 hover:gap-5 transition-[gap]">
          Go to cart <span aria-hidden>→</span>
        </button>
      </div>
    </section>
  );
}
