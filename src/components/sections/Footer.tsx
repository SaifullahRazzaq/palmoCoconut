"use client";

/* ADDITIONAL SECTION — not in the reference video. Footer closing on the
   brand's dark husk brown with the scalloped edge and a giant wordmark. */

import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { useNavTheme } from "@/hooks/useNavTheme";
import { Scallop } from "@/components/ui/Scallop";
import { scrollToTarget, useLenis } from "@/components/SmoothScroll";

const COLUMNS = [
  { title: "Explore", links: [["Story", "#story"], ["Benefits", "#benefits"], ["Collection", "#collection"], ["Showcase", "#showcase"]] },
  { title: "Company", links: [["Our story", "#story-brand"], ["Sourcing", "#source"], ["Shop", "#shop"]] },
];

export function Footer() {
  const root = useRef<HTMLElement>(null);
  useNavTheme(root, "light");
  const lenis = useLenis();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  useGsap(root, (q) => {
    gsap.from(q(".footer-letter"), {
      yPercent: 100,
      stagger: 0.05,
      ease: "power3.out",
      scrollTrigger: { trigger: q(".footer-mark")[0], start: "top bottom", end: "bottom bottom", scrub: true },
    });
  });

  return (
    <footer ref={root} className="relative z-10 bg-bark text-paper">
      <Scallop color="#24160c" size="clamp(56px, 7vw, 120px)" />
      <div className="grid gap-12 px-[4vw] pb-10 pt-[12vh] lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="display text-[clamp(2.6rem,5vw,5rem)]">
            Keep <span className="text-sun">sipping.</span>
          </p>
          <p className="mt-4 max-w-[36ch] text-paper/60">Harvest notes, new flavours and the occasional free crate. One email a month.</p>
          {sent ? (
            <p className="mt-8 font-serif text-2xl italic text-sun">Thank you — see you next harvest.</p>
          ) : (
            <form
              className="mt-8 flex max-w-md border-b border-paper/40 focus-within:border-sun"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setSent(true);
              }}
            >
              <label htmlFor="newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="min-w-0 flex-1 bg-transparent py-3 text-lg outline-none placeholder:text-paper/35"
              />
              <button className="eyebrow px-2 text-sun">Subscribe →</button>
            </form>
          )}
        </div>
        {COLUMNS.map((c) => (
          <div key={c.title}>
            <p className="eyebrow mb-5 text-paper/45">{c.title}</p>
            <ul className="space-y-2">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <button onClick={() => scrollToTarget(lenis, href)} className="text-xl transition-colors hover:text-sun">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-mark overflow-hidden px-[2vw]">
        <p className="display flex justify-between text-[31vw] leading-[0.76] text-husk" aria-label="PALMO">
          {"PALMO".split("").map((l, i) => (
            <span key={i} className="inline-block overflow-hidden" aria-hidden>
              <span className="footer-letter inline-block">{l}</span>
            </span>
          ))}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-paper/10 px-[4vw] py-6 text-xs text-paper/45">
        <span>© {new Date().getFullYear()} PALMO Coconut Co. — Concept website.</span>
        <span>Grown in Ratchaburi, Thailand</span>
        <button onClick={() => scrollToTarget(lenis, "#top")} className="eyebrow text-paper/70 hover:text-sun">
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
