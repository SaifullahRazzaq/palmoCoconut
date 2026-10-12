"use client";

/* ADDITIONAL SECTION — not in the reference video. The product collection,
   laid out as editorial columns rather than cards. */

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { VARIANTS } from "@/lib/products";
import { requestVariant } from "@/lib/events";
import { CartonImage } from "@/components/ui/CartonImage";
import { scrollToTarget, useLenis } from "@/components/SmoothScroll";

export function Collection() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGsap(root, (q) => {
    gsap.from(q(".col-title .word"), {
      yPercent: 110,
      stagger: 0.08,
      duration: 1.2,
      ease: "expo.out",
      scrollTrigger: { trigger: q(".col-title")[0], start: "top 85%" },
    });
    q(".product").forEach((el, i) => {
      gsap.from(el.querySelector(".product-art"), {
        yPercent: 18 + i * 6,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.from(el, { autoAlpha: 0, y: 80, duration: 1.2, ease: "expo.out", delay: i * 0.08, scrollTrigger: { trigger: el, start: "top 90%" } });
    });
  });

  const explore = (id: string) => {
    requestVariant(id);
    scrollToTarget(lenis, "#showcase");
  };

  return (
    <section ref={root} id="collection" className="bg-paper px-[4vw] py-[16vh] text-ink">
      <div className="mb-[8vh] flex flex-wrap items-end justify-between gap-8">
        <div>
          <span className="eyebrow mb-6 block text-ink/50">(06) — Collection</span>
          <h2 className="col-title display text-[clamp(3.6rem,10vw,11rem)]">
            <span className="inline-block overflow-hidden align-top">
              <span className="word inline-block">Four</span>
            </span>{" "}
            <span className="inline-block overflow-hidden align-top">
              <span className="word inline-block">ways</span>
            </span>
            <br />
            <span className="inline-block overflow-hidden align-top">
              <span className="word inline-block">to sip</span>
            </span>
          </h2>
        </div>
        <p className="max-w-[30ch] text-ink/70">
          Every flavour starts as the same young coconut. We only ever add one thing — and we tell you exactly what.
        </p>
      </div>

      <div className="grid grid-cols-1 border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-4">
        {VARIANTS.map((v, i) => (
          <article
            key={v.id}
            className="product group relative flex flex-col border-b border-ink/15 py-8 sm:px-6 lg:border-b-0 lg:border-l lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="eyebrow text-ink/50">0{i + 1}</span>
              <span className="eyebrow">${v.price.toFixed(2)}</span>
            </div>
            <button
              onClick={() => explore(v.id)}
              className="relative mb-8 grid aspect-[4/5] place-items-center overflow-hidden"
              aria-label={`Explore ${v.name} in 3D`}
            >
              <span
                className="absolute inset-x-[10%] bottom-[6%] top-[14%] origin-bottom scale-y-[0.35] rounded-t-full transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-y-100"
                style={{ background: v.id === "original" ? "#f3e8d6" : v.body === "#ffd21a" ? "#ffe57a" : v.body }}
              />
              <div className="product-art relative w-[42%] transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-translate-y-3 group-hover:[--carton-tilt:-44deg]">
                <CartonImage variant={v} />
              </div>
            </button>
            <h3 className="display text-[clamp(2.4rem,3.4vw,3.4rem)]">{v.name}</h3>
            <p className="mb-6 mt-2 text-ink/65">{v.flavor}</p>
            <button
              onClick={() => explore(v.id)}
              className="eyebrow mt-auto flex items-center gap-3 self-start border-b border-ink pb-1 transition-[gap] hover:gap-5"
            >
              Explore in 3D <span aria-hidden>→</span>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
