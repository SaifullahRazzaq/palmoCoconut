"use client";

/* ADDITIONAL SECTION — not in the reference video. Brand story on the
   tropical-yellow ground established by the PALMO reveal. */

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { Scallop } from "@/components/ui/Scallop";
import { SplitWords } from "@/components/ui/SplitText";
import { Frond, Blob, CoconutIllustration } from "@/components/story/Shapes";

const MILESTONES = [
  { year: "2019", text: "A single family grove of 400 Nam Hom palms outside Damnoen Saduak." },
  { year: "2021", text: "Our own filling room built beside the grove — six hours from palm to carton." },
  { year: "2024", text: "Fourteen partner farms, one rule: every carton traceable to its grove." },
];

export function BrandStory() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (q) => {
    gsap.fromTo(
      q(".quote .word"),
      { yPercent: 105 },
      {
        yPercent: 0,
        stagger: 0.04,
        ease: "power3.out",
        scrollTrigger: { trigger: q(".quote")[0], start: "top 80%", end: "bottom 60%", scrub: true },
      },
    );
    gsap.to(q(".story-frond"), {
      rotate: 18,
      yPercent: -20,
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.to(q(".story-blob"), {
      rotate: 180,
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.from(q(".milestone"), {
      y: 50,
      autoAlpha: 0,
      stagger: 0.15,
      duration: 1.1,
      ease: "expo.out",
      scrollTrigger: { trigger: q(".milestones")[0], start: "top 85%" },
    });
  });

  return (
    <section ref={root} id="story-brand" className="relative z-10 bg-sun px-[4vw] pb-[16vh] pt-[14vh] text-shell">
      <Scallop color="#ffd21a" size="clamp(56px, 7vw, 120px)" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Frond className="story-frond absolute -right-[8vw] top-[16vh] w-[36vw] min-w-[240px] opacity-90" />
        <Blob className="story-blob absolute right-[5vw] top-[62%] w-[8vw] min-w-[64px] text-husk" />
      </div>

      <div className="relative">
        <span className="eyebrow mb-10 block text-shell/60">(08) — Our story</span>
        <blockquote className="quote max-w-[20ch] font-serif text-[clamp(2.6rem,6.4vw,7rem)] leading-[0.98]">
          <SplitWords text="We never set out to make a drink. We just wanted the city to taste the grove." />
        </blockquote>
        <div className="mt-8 flex items-center gap-4">
          <CoconutIllustration className="h-12 w-12" />
          <p className="eyebrow">Ploy &amp; Arun, founders — Ratchaburi</p>
        </div>

        <ol className="milestones mt-[12vh] grid gap-10 border-t border-shell/25 pt-10 md:grid-cols-3">
          {MILESTONES.map((m) => (
            <li key={m.year} className="milestone">
              <span className="display block text-[clamp(3rem,5vw,5rem)]">{m.year}</span>
              <p className="mt-3 max-w-[30ch] leading-relaxed">{m.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
