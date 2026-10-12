"use client";

import { RefObject, useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/** Switches the fixed nav to light text while a dark section sits beneath it. */
export function useNavTheme(ref: RefObject<HTMLElement | null>, theme: "light" | "dark") {
  useEffect(() => {
    if (!ref.current) return;
    const set = (t: string) => {
      if (document.documentElement.dataset.nav !== t) document.documentElement.dataset.nav = t;
    };
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 40px",
      end: "bottom 40px",
      onToggle: (self) => set(self.isActive ? theme : "dark"),
    });
    return () => st.kill();
  }, [ref, theme]);
}
