"use client";

/* ADDITIONAL SECTION — not in the reference video. Product introduction that
   continues straight out of the yellow PALMO scene. */

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { Scallop } from "@/components/ui/Scallop";
import { SplitWords } from "@/components/ui/SplitText";
import { CoconutIllustration } from "@/components/story/Shapes";

const STATS = [
  { value: 6, suffix: "h", label: "Palm to carton" },
  { value: 330, suffix: "ml", label: "One whole coconut" },
  { value: 0, suffix: "g", label: "Added sugar" },
];

export function Intro() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (q) => {
    gsap.to(q(".badge-ring"), {
      rotate: 300,
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.fromTo(
      q(".statement .word"),
      { opacity: 0.12 },
      {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: { trigger: q(".statement")[0], start: "top 80%", end: "bottom 45%", scrub: true },
      },
    );
    q(".stat-num").forEach((el) => {
      const target = Number(el.dataset.value);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target,
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
        onUpdate: () => (el.textContent = Math.round(obj.v).toString()),
      });
    });
    gsap.from(q(".stat"), {
      y: 60,
      autoAlpha: 0,
      stagger: 0.12,
      duration: 1.2,
      ease: "expo.out",
      scrollTrigger: { trigger: q(".stats")[0], start: "top 85%" },
    });
  });

  return (
    <section ref={root} id="intro" className="relative bg-paper pb-[12vh] pt-[18vh] text-ink">
      <Scallop color="#ffd21a" size="clamp(56px, 7vw, 120px)" flip className="!top-0" />
      <div className="px-[4vw]">
        <div className="mb-10 flex items-center justify-between">
          <span className="eyebrow text-ink/50">(04) — Product</span>
          <span className="eyebrow text-ink/50">Original · 330 ml</span>
        </div>
        <div className="flex items-start justify-between gap-8">
          <h2 className="statement display max-w-[15ch] text-[clamp(3.2rem,9.4vw,10rem)]">
            <SplitWords text="One young coconut. One carton. Nothing else." />
          </h2>
          <div className="relative mt-4 hidden aspect-square w-[min(22vw,300px)] shrink-0 md:block" aria-hidden>
            <svg viewBox="0 0 200 200" className="badge-ring absolute inset-0 h-full w-full">
              <defs>
                <path id="badge-circle" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
              </defs>
              <text className="fill-ink text-[13.2px] font-bold uppercase tracking-[0.2em]">
                <textPath href="#badge-circle">100% coconut water · never from concentrate ·</textPath>
              </text>
            </svg>
            <div className="absolute inset-[24%] rounded-full bg-sun p-[10%]">
              <CoconutIllustration className="h-full w-full" />
            </div>
          </div>
        </div>

        <div className="mt-[12vh] grid gap-12 md:grid-cols-[1fr_2fr]">
          <p className="max-w-[34ch] text-base leading-relaxed text-ink/75 md:text-lg">
            We tap a single Nam Hom coconut at nine months — the moment its water is sweetest — and fill the
            carton cold, the same morning. No heat, no concentrate, no blending across harvests.
          </p>
          <div className="stats grid grid-cols-1 border-t border-ink/15 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className="stat border-b border-ink/15 py-6 sm:border-b-0 sm:border-l sm:px-6 sm:first:border-l-0 sm:first:pl-0">
                <div className="display flex items-start text-[clamp(4rem,8vw,8rem)]">
                  <span className="stat-num" data-value={s.value}>
                    {s.value}
                  </span>
                  <span className="mt-[0.12em] text-[0.35em] text-husk">{s.suffix}</span>
                </div>
                <p className="eyebrow mt-3 text-ink/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-[14vh] overflow-hidden border-y border-ink/10 bg-husk py-5 text-paper">
        <div className="marquee-track flex w-max whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
              {["Keep sipping", "Real coconut", "Never from concentrate", "Cold filled", "Palmo"].map((w) => (
                <span key={w} className="display flex items-center text-[clamp(2rem,4vw,3.6rem)]">
                  <span className="px-8">{w}</span>
                  <span className="block h-4 w-4 rounded-full bg-sun" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
