"use client";

import { DependencyList, RefObject, useEffect, useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "./useReducedMotion";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Scoped GSAP setup with automatic cleanup. The callback is skipped entirely
 * when the user prefers reduced motion, so content renders in its final state.
 */
export function useGsap(
  scope: RefObject<HTMLElement | null>,
  setup: (q: (selector: string) => HTMLElement[]) => void,
  deps: DependencyList = [],
) {
  const reduced = useReducedMotion();
  useIsoLayoutEffect(() => {
    if (reduced || !scope.current) return;
    const ctx = gsap.context(() => setup(gsap.utils.selector(scope.current) as never), scope);
    return () => ctx.revert();
  }, [reduced, ...deps]);
  return reduced;
}
