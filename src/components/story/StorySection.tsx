"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { BEATS, story } from "@/lib/story";
import { VARIANTS } from "@/lib/products";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGL } from "@/hooks/useWebGL";
import { useInView } from "@/hooks/useInView";
import { useFontsReady } from "@/hooks/useFontsReady";
import { Scallop } from "@/components/ui/Scallop";
import { SplitChars } from "@/components/ui/SplitText";
import { CartonImage } from "@/components/ui/CartonImage";
import { CoconutIllustration, Frond, Blob } from "./Shapes";

const StoryCanvas = dynamic(() => import("@/components/three/StoryCanvas"), { ssr: false });

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const HUSK = "#6e4527";
const HUSK_LIGHT = "#8a5a36";
const SUN = "#ffd21a";

function setNavTheme(theme: "dark" | "light") {
  if (document.documentElement.dataset.nav !== theme) document.documentElement.dataset.nav = theme;
}

/* -------------------------------------------------------------------------- */
/*  Layers — shared by the animated and reduced-motion versions               */
/* -------------------------------------------------------------------------- */

function HeroCopy() {
  return (
    <>
      <h1 className="hero-title display relative px-[3vw] pt-[12vh] text-[14.2vw] text-ink portrait:pt-[13vh] portrait:text-[19.5vw] md:pt-[10.5vh]">
        <span className="sr-only">The real source of every sip.</span>
        {/* landscape: two lines */}
        <span aria-hidden className="portrait:hidden">
          <span className="mask">
            <span>The real source</span>
          </span>
          <span className="mask">
            <span>
              of every <span className="text-husk">sip.</span>
            </span>
          </span>
        </span>
        {/* portrait: three tighter lines */}
        <span aria-hidden className="hidden portrait:block">
          <span className="mask">
            <span>The real</span>
          </span>
          <span className="mask">
            <span>source of</span>
          </span>
          <span className="mask">
            <span>
              every <span className="text-husk">sip.</span>
            </span>
          </span>
        </span>
      </h1>

      <div className="hero-meta absolute inset-x-0 bottom-0 grid grid-cols-2 items-end gap-6 px-[4vw] pb-8 md:grid-cols-3">
        <p className="max-w-[26ch] text-sm leading-relaxed text-ink/75 md:text-[0.95rem]">
          Pressed from a single young Nam Hom coconut within hours of harvest. Nothing added. Nothing taken away.
        </p>
        <div className="hidden justify-center md:flex">
          <div className="flex flex-col items-center gap-3">
            <span className="relative block h-9 w-5 rounded-full border border-ink/40">
              <span className="scroll-dot absolute left-1/2 top-1.5 h-1.5 w-1 -translate-x-1/2 rounded-full bg-ink" />
            </span>
            <span className="eyebrow text-ink/60">Scroll to open</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <span className="eyebrow text-ink/50">(01) — Origin</span>
          <span className="font-serif text-2xl italic leading-none md:text-3xl">Ratchaburi, Thailand</span>
        </div>
      </div>

      {/* annotation near the coconut */}
      <div className="hero-note absolute left-[66%] top-[60%] hidden items-center gap-3 lg:flex">
        <span className="block h-px w-16 bg-ink/40" />
        <span className="eyebrow leading-snug text-ink/70">
          N° 01
          <br />
          Young coconut, cut fresh
        </span>
      </div>
    </>
  );
}

function BrownPanel({ reduced }: { reduced: boolean }) {
  return (
    <div
      className="brown-panel absolute inset-0 text-paper"
      style={{ background: HUSK, transform: reduced ? undefined : "translateY(112%)" }}
    >
      <Scallop color={HUSK} size="clamp(56px, 7vw, 120px)" />
      <div className="relative flex h-full flex-col justify-center overflow-hidden px-[3vw]">
        {/* floating yellow dots */}
        {[
          ["8%", "18%", "3.2vw"],
          ["86%", "22%", "1.6vw"],
          ["78%", "74%", "4.4vw"],
          ["16%", "78%", "1.2vw"],
          ["60%", "28%", "0.9vw"],
          ["30%", "62%", "0.7vw"],
        ].map(([l, t, s], i) => (
          <span
            key={i}
            data-depth={(i % 3) + 1}
            className="sun-dot absolute rounded-full"
            style={{ left: l, top: t, width: `max(${s}, 10px)`, height: `max(${s}, 10px)`, background: SUN }}
          />
        ))}

        <h2 className="sipping display relative flex flex-col text-center text-[21vw] leading-[0.8] text-paper portrait:gap-[36vh] portrait:text-[25vw] md:text-[19vw]">
          <span className="sip-line block">
            <SplitChars text="Keep" />
          </span>
          <span className="sip-line block">
            <SplitChars text="Sipping." />
          </span>
        </h2>

        <div className="brown-meta absolute inset-x-0 bottom-0 grid grid-cols-2 items-end gap-6 px-[4vw] pb-8 md:grid-cols-3">
          <p className="max-w-[28ch] text-sm leading-relaxed text-paper/80 md:text-[0.95rem]">
            Coconut water the way the palm made it — cold-filled, never from concentrate, never heated.
          </p>
          <div className="hidden justify-center md:flex">
            {reduced ? null : <span className="eyebrow text-paper/60">(02) — The carton</span>}
          </div>
          <ul className="eyebrow flex flex-col items-end gap-1.5 text-right text-paper/85">
            <li>620 mg potassium</li>
            <li>0 g added sugar</li>
            <li>1 coconut per carton</li>
          </ul>
        </div>
      </div>
      {reduced && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <CartonImage variant={VARIANTS[0]} className="w-[min(34vw,260px)]" />
        </div>
      )}
    </div>
  );
}

function YellowPanel({ reduced }: { reduced: boolean }) {
  return (
    <div
      className="yellow-panel absolute inset-0 text-shell"
      style={{ background: SUN, transform: reduced ? undefined : "translateY(112%)" }}
    >
      <Scallop color={SUN} size="clamp(56px, 7vw, 120px)" offset="calc(clamp(56px, 7vw, 120px) / 2)" />
      <div className="relative h-full overflow-hidden">
        {/* organic brown shapes */}
        <Frond className="shape shape-a absolute -left-[7vw] top-[9vh] w-[30vw] min-w-[220px] text-shell" />
        <Frond className="shape shape-b absolute -right-[9vw] top-[44vh] w-[24vw] min-w-[180px] -scale-x-100 text-shell" />
        <Blob className="shape shape-c absolute right-[13vw] top-[13vh] w-[9vw] min-w-[70px] text-husk" />
        <CoconutIllustration className="shape shape-d absolute bottom-[14vh] left-[8vw] w-[9vw] min-w-[70px]" />
        <span className="shape shape-e absolute left-[46%] top-[16vh] block h-[1.4vw] min-h-3 w-[1.4vw] min-w-3 rounded-full bg-shell" />

        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="palmo display flex text-[33vw] leading-[0.78] text-shell" aria-label="PALMO">
            {"PALMO".split("").map((l, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.02em]" aria-hidden>
                <span className="palmo-letter inline-block origin-bottom will-change-transform">{l}</span>
              </span>
            ))}
          </h2>
        </div>

        <div className="yellow-meta absolute inset-x-0 bottom-0 z-10 grid grid-cols-2 items-end gap-6 px-[4vw] pb-8 md:grid-cols-3">
          <p className="font-serif text-2xl italic leading-none md:text-4xl">Since 2019</p>
          <div className="hidden justify-center md:flex">
            <span className="eyebrow text-shell/70">(03) — The brand</span>
          </div>
          <p className="justify-self-end text-right text-sm font-medium leading-relaxed md:text-[0.95rem]">
            Premium coconut water.
            <br />
            Grown, cut &amp; carton-filled in Thailand.
          </p>
        </div>
      </div>
      {reduced && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <CartonImage variant={VARIANTS[0]} tilt={18} className="w-[min(30vw,230px)]" />
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function ChapterCounter() {
  return (
    <div className="chapter pointer-events-none absolute right-[4vw] top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
      <span className="chapter-num eyebrow tabular-nums">01</span>
      <span className="relative block h-24 w-px bg-current/20">
        <span className="chapter-bar absolute inset-x-0 top-0 block h-full origin-top scale-y-0 bg-current" />
      </span>
      <span className="eyebrow opacity-50">03</span>
    </div>
  );
}

export function StorySection() {
  const reduced = useReducedMotion();
  const webgl = useWebGL();
  const wrap = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, "100px");
  const fontsReady = useFontsReady();

  // Pointer parallax feeds the 3D scene
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      story.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      story.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useIsoLayoutEffect(() => {
    if (reduced || !wrap.current) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(stage);
      // Panels start off-screen via inline styles (no flash before hydration);
      // hand the transform over to GSAP so yPercent is the only offset.
      gsap.set(q(".husk-under, .brown-panel, .yellow-panel"), { clearProps: "transform" });

      // Intro — time based, plays once on load
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(q(".hero-title .mask > span"), { yPercent: 110, duration: 1.4, stagger: 0.12 }, 0.15)
        .from(q(".hero-meta > *, .hero-note"), { y: 24, autoAlpha: 0, duration: 1.1, stagger: 0.08 }, 0.6)
        .from(q(".canvas-layer"), { autoAlpha: 0, scale: 0.9, duration: 1.8 }, 0.2);

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            story.progress = p;
            setNavTheme(p > 0.3 && p < 0.68 ? "light" : "dark");
            const n = p < 0.3 ? "01" : "02";
            const num = q(".chapter-num")[0];
            if (num && num.textContent !== n) num.textContent = n;
          },
          onLeave: () => setNavTheme("dark"),
          onLeaveBack: () => setNavTheme("dark"),
        },
      });

      const at = (range: readonly [number, number]) => ({ pos: range[0], dur: range[1] - range[0] });

      // Beat 1 — hero headline lifts away while the coconut opens
      tl.to(q(".hero-meta, .hero-note"), { autoAlpha: 0, y: -30, duration: 0.1 }, 0.03);
      tl.to(q(".hero-title .mask > span"), { yPercent: -105, duration: 0.14, stagger: 0.03, ease: "power2.in" }, 0.1);
      tl.to(q(".hero-title"), { y: "-8vh", duration: 0.26 }, 0);

      // Beat 2 — organic brown waves rise
      const b = at(BEATS.brownIn);
      tl.fromTo(q(".husk-under"), { yPercent: 112 }, { yPercent: 0, duration: b.dur, ease: "power2.inOut" }, b.pos - 0.03);
      tl.fromTo(q(".brown-panel"), { yPercent: 112 }, { yPercent: 0, duration: b.dur, ease: "power2.inOut" }, b.pos);
      const s = at(BEATS.sipping);
      tl.from(q(".sipping .char"), { yPercent: 115, rotate: 6, duration: s.dur * 0.7, stagger: s.dur * 0.035, ease: "power3.out" }, s.pos);
      tl.from(q(".brown-meta > *"), { autoAlpha: 0, y: 24, duration: 0.05, stagger: 0.01 }, s.pos + s.dur * 0.6);
      tl.fromTo(q(".sun-dot"), { scale: 0 }, { scale: 1, duration: 0.08, stagger: 0.01, ease: "back.out(2)" }, s.pos + 0.02);
      q(".sun-dot").forEach((el) => {
        const depth = Number((el as HTMLElement).dataset.depth);
        tl.fromTo(el, { y: `${depth * 6}vh` }, { y: `${-depth * 8}vh`, duration: 0.4 }, b.pos);
      });
      // Headline drifts apart as the carton turns
      tl.to(q(".sip-line")[0], { xPercent: -9, duration: 0.24 }, 0.5);
      tl.to(q(".sip-line")[1], { xPercent: 7, duration: 0.24 }, 0.5);

      // Beat 3 — tropical yellow floods in, PALMO rises
      const y = at(BEATS.yellowIn);
      tl.fromTo(q(".yellow-panel"), { yPercent: 112 }, { yPercent: 0, duration: y.dur, ease: "power2.inOut" }, y.pos);
      const pm = at(BEATS.palmo);
      tl.from(
        q(".palmo-letter"),
        { yPercent: 105, scaleY: 1.5, duration: pm.dur * 0.7, stagger: pm.dur * 0.07, ease: "power3.out" },
        pm.pos,
      );
      tl.from(q(".shape-a"), { xPercent: -40, yPercent: -30, rotate: -35, duration: 0.2, ease: "power2.out" }, y.pos + 0.04);
      tl.from(q(".shape-b"), { xPercent: 40, yPercent: 40, rotate: 30, duration: 0.2, ease: "power2.out" }, y.pos + 0.06);
      tl.from(q(".shape-c, .shape-d, .shape-e"), { scale: 0, rotate: -90, duration: 0.12, stagger: 0.03, ease: "back.out(1.6)" }, pm.pos + 0.04);
      tl.to(q(".shape-a"), { rotate: 8, yPercent: 6, duration: 0.2 }, 0.8);
      tl.to(q(".shape-b"), { rotate: -8, yPercent: -6, duration: 0.2 }, 0.8);
      tl.from(q(".yellow-meta > *"), { autoAlpha: 0, y: 24, duration: 0.05, stagger: 0.01 }, pm.pos + pm.dur * 0.7);
      tl.to(q(".palmo"), { scale: 1.06, duration: 0.14 }, 0.86);

      tl.to(q(".chapter-bar"), { scaleY: 1, duration: 0.7 }, 0);
      tl.to(q(".chapter"), { autoAlpha: 0, duration: 0.05 }, 0.66);
      tl.set({}, {}, 1); // lock the timeline length to exactly 1
    }, stage);
    return () => {
      ctx.revert();
      story.progress = 0;
    };
  }, [reduced]);

  /* ---------------------- reduced motion: static stack --------------------- */
  if (reduced) {
    return (
      <section id="story" ref={wrap} aria-label="PALMO story">
        <div className="relative h-svh min-h-[640px] overflow-hidden bg-paper">
          <HeroCopy />
          <div className="absolute inset-x-0 bottom-[10vh] top-[30vh]">
            {webgl && fontsReady ? <StoryCanvas active={inView} still /> : <CoconutIllustration className="mx-auto h-full" />}
          </div>
        </div>
        <div className="relative z-10 h-svh min-h-[640px]">
          <BrownPanel reduced />
        </div>
        <div className="relative z-20 h-svh min-h-[640px]">
          <YellowPanel reduced />
        </div>
      </section>
    );
  }

  /* --------------------------- full cinematic story ------------------------ */
  return (
    <section id="story" ref={wrap} className="relative h-[620vh]" aria-label="PALMO story">
      <div ref={stage} className="sticky top-0 h-svh min-h-[560px] overflow-hidden bg-paper">
        <HeroCopy />

        {/* lighter husk wave travelling just ahead of the brown panel */}
        <div className="husk-under absolute inset-0" style={{ background: HUSK_LIGHT, transform: "translateY(112%)" }}>
          <Scallop color={HUSK_LIGHT} size="clamp(56px, 7vw, 120px)" offset="calc(clamp(56px, 7vw, 120px) / 2)" />
        </div>
        <BrownPanel reduced={false} />
        <YellowPanel reduced={false} />

        <div className="canvas-layer pointer-events-none absolute inset-0 z-30">
          {webgl === false ? (
            <div className="absolute inset-x-0 bottom-[8vh] top-[32vh]">
              <CoconutIllustration className="mx-auto h-full" />
            </div>
          ) : (
            webgl && fontsReady && <StoryCanvas active={inView} />
          )}
        </div>

        <ChapterCounter />
      </div>
    </section>
  );
}
