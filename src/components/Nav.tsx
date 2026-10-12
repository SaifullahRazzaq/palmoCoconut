"use client";

import { useState } from "react";
import { scrollToTarget, useLenis } from "./SmoothScroll";
import { useCart } from "./CartContext";

const LINKS = [
  { label: "Story", href: "#story" },
  { label: "Benefits", href: "#benefits" },
  { label: "Collection", href: "#collection" },
  { label: "Source", href: "#source" },
  { label: "Shop", href: "#shop" },
];

export function Nav() {
  const lenis = useLenis();
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);

  const go = (href: string) => {
    setMenu(false);
    scrollToTarget(lenis, href);
  };

  return (
    <header className="site-nav fixed inset-x-0 top-0 z-50 text-ink transition-colors duration-500">
      <nav className="flex items-center justify-between gap-6 px-[4vw] py-5">
        <button onClick={() => go("#top")} className="display text-[1.9rem] leading-none tracking-tight" aria-label="PALMO home">
          Palmo<span className="text-sun-deep">.</span>
        </button>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <button onClick={() => go(l.href)} className="eyebrow group relative py-1">
                {l.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-current transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="eyebrow flex items-center gap-2 rounded-full border border-current px-4 py-2 transition-colors hover:bg-ink hover:text-paper"
          >
            Cart
            <span className="grid h-5 min-w-5 place-items-center rounded-full border border-ink/20 bg-sun px-1 text-[0.65rem] text-ink">{count}</span>
          </button>
          <button
            className="eyebrow md:hidden"
            onClick={() => setMenu((m) => !m)}
            aria-expanded={menu}
            aria-controls="mobile-menu"
          >
            {menu ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!menu}
        className="fixed inset-0 top-0 -z-10 bg-sun px-[6vw] pt-28 text-ink md:hidden"
      >
        <ul className="space-y-2">
          {LINKS.map((l) => (
            <li key={l.href}>
              <button onClick={() => go(l.href)} className="display text-[18vw]">
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
