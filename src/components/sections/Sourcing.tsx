"use client";

/* ADDITIONAL SECTION — not in the reference video. Ingredients & sourcing:
   a scroll-drawn path from palm to carton. */

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";

const STEPS = [
  { t: "05:30", title: "Harvest", body: "Climbers pick nine-month coconuts by hand, before the heat of the day." },
  { t: "07:00", title: "Crack", body: "Each coconut is opened within the grove and its water tasted for sweetness." },
  { t: "09:30", title: "Filter", body: "A single micro-filtration step. No heat — the flavour stays alive." },
  { t: "11:30", title: "Carton", body: "Cold-filled into paper-based cartons, batch-coded to the grove." },
];

export function Sourcing() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (q) => {
    const path = q(".route")[0] as unknown as SVGPathElement;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: { trigger: q(".steps")[0], start: "top 75%", end: "bottom 60%", scrub: true },
    });
    q(".step").forEach((el) => {
      gsap.from(el.querySelector(".step-dot"), { scale: 0, duration: 0.8, ease: "back.out(2)", scrollTrigger: { trigger: el, start: "top 75%" } });
      gsap.from(el.querySelectorAll(".step-copy > *"), {
        y: 30,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
    });
    gsap.from(q(".ingredient-line"), {
      scaleX: 0,
      transformOrigin: "left",
      duration: 1.4,
      ease: "expo.out",
      scrollTrigger: { trigger: q(".ingredients")[0], start: "top 80%" },
    });
  });

  return (
    <section ref={root} id="source" className="relative bg-cream px-[4vw] py-[16vh] text-ink">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div className="lg:sticky lg:top-[14vh] lg:self-start">
          <span className="eyebrow mb-6 block text-ink/50">(09) — Ingredients &amp; sourcing</span>
          <h2 className="display text-[clamp(3.4rem,8vw,8.6rem)]">
            Palm to carton
            <br />
            in <span className="text-husk">six hours</span>
          </h2>

          <div className="ingredients mt-12 max-w-md">
            <p className="eyebrow mb-4 text-ink/50">Full ingredient list — Original</p>
            <div className="ingredient-line hairline mb-4" />
            <div className="flex items-baseline justify-between gap-6">
              <span className="font-serif text-4xl italic">Young coconut water</span>
              <span className="display text-4xl">100%</span>
            </div>
            <div className="ingredient-line hairline mt-4" />
            <p className="mt-4 text-sm text-ink/60">That&apos;s the list. Flavoured variants add one named ingredient each.</p>
          </div>
        </div>

        <div className="steps relative">
          <svg className="pointer-events-none absolute left-[22px] top-0 h-full w-[60px] overflow-visible" preserveAspectRatio="none" viewBox="0 0 60 1000" aria-hidden>
            <path d="M8 0 C 60 160, -40 330, 8 500 S 60 840, 8 1000" fill="none" stroke="#6e4527" strokeWidth="3" vectorEffect="non-scaling-stroke" className="route" />
          </svg>
          <ol className="relative space-y-[10vh] py-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="step grid grid-cols-[60px_1fr] gap-6">
                <span className="step-dot relative z-10 grid h-12 w-12 place-items-center rounded-full bg-sun text-sm font-bold">
                  0{i + 1}
                </span>
                <div className="step-copy border-b border-ink/15 pb-[8vh]">
                  <span className="eyebrow block text-husk">{s.t}</span>
                  <h3 className="display mt-2 text-[clamp(2.8rem,5vw,5rem)]">{s.title}</h3>
                  <p className="mt-3 max-w-[40ch] text-lg leading-relaxed text-ink/70">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
