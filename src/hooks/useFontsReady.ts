"use client";

import { useEffect, useState } from "react";

/** Canvas-painted carton artwork must wait for the web fonts, or it caches fallbacks. */
export function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);
  return ready;
}
