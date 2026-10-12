"use client";

/* ADDITIONAL SECTION — not in the reference video. Coconut water benefits as a
   pinned horizontal scroll on desktop; a vertical stack on mobile / reduced motion. */

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { useNavTheme } from "@/hooks/useNavTheme";

const BENEFITS = [
  {
    n: "620",
    unit: "mg",
    title: "Potassium",
    body: "More than a banana, per carton. The mineral your muscles lose first when you sweat.",
    dot: 0.9,
  },
  {
    n: "05",
    unit: "",
    title: "Natural electrolytes",
    body: "Potassium, sodium, magnesium, calcium and phosphorus — balanced by the palm, not a lab.",
    dot: 0.62,
  },
  {
    n: "62",
    unit: "kcal",
    title: "Light by nature",
    body: "Naturally low in calories, with just the gentle sweetness of the coconut itself.",
    dot: 0.44,
  },
  {
    n: "00",
    unit: "g",
    title: "Added anything",
    body: "No sugar, no flavourings, no preservatives, no concentrate. The list stops at coconut.",
    dot: 0.28,
  },
];

export function Benefits() {
  const root = useRef<HTMLElement>(null);
  useNavTheme(root, "light");
  const track = useRef<HTMLDivElement>(null);

  const reduced = useGsap(root, (q) => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth;
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      q(".benefit").forEach((panel) => {
        gsap.from(panel.querySelectorAll(".b-dot"), {
          scale: 0,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 85%", end: "left 35%", scrub: true },
        });
        gsap.from(panel.querySelectorAll(".b-num"), {
          yPercent: 100,
          ease: "power3.out",
          scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 90%", end: "left 45%", scrub: true },
        });
      });
    });
    mm.add("(max-width: 899px)", () => {
      q(".benefit").forEach((panel) => {
        gsap.from(panel, { y: 60, autoAlpha: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: panel, start: "top 85%" } });
      });
    });
    ScrollTrigger.refresh();
  });

  return (
    <section ref={root} id="benefits" className="relative overflow-hidden bg-shell text-paper">
      <div
        ref={track}
        className={`flex flex-col ${reduced ? "" : "min-[900px]:h-svh min-[900px]:w-max min-[900px]:flex-row"}`}
      >
        <div className="flex shrink-0 flex-col justify-between px-[4vw] py-[12vh] min-[900px]:w-[46vw] min-[900px]:py-[14vh]">
          <span className="eyebrow text-paper/50">(05) — Benefits</span>
          <h2 className="display my-10 text-[clamp(4rem,11vw,12rem)]">
            What&apos;s
            <br />
            <span className="text-sun">inside</span>
          </h2>
          <p className="max-w-[32ch] text-paper/70">
            Coconut water is the palm&apos;s own isotonic drink. Here is everything a single PALMO carton brings.
          </p>
        </div>

        {BENEFITS.map((b, i) => (
          <article
            key={b.title}
            className="benefit relative flex shrink-0 flex-col justify-between border-t border-paper/15 px-[4vw] py-[10vh] min-[900px]:w-[38vw] min-[900px]:border-l min-[900px]:border-t-0 min-[900px]:py-[14vh]"
          >
            <span className="eyebrow text-paper/50">0{i + 1}</span>
            <div className="relative my-10">
              <span
                className="b-dot absolute -left-[4%] top-1/2 block aspect-square -translate-y-1/2 rounded-full bg-sun"
                style={{ width: `${b.dot * 60}%` }}
              />
              <div className="relative overflow-hidden">
                <div className="b-num display flex items-start text-[clamp(7rem,15vw,16rem)] mix-blend-normal">
                  {b.n}
                  <span className="ml-2 mt-[0.14em] text-[0.24em]">{b.unit}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="display mb-3 text-[clamp(1.8rem,2.6vw,2.6rem)] leading-none">{b.title}</h3>
              <p className="max-w-[34ch] text-paper/70">{b.body}</p>
            </div>
          </article>
        ))}
        <div className="hidden shrink-0 min-[900px]:block min-[900px]:w-[8vw]" />
      </div>
    </section>
  );
}
