"use client";

import { useSyncExternalStore } from "react";

let cached: boolean | null = null;

function detect() {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    cached = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    cached = false;
  }
  return cached;
}

const noop = () => () => {};

/** `null` during SSR, then whether the device can create a WebGL context. */
export function useWebGL(): boolean | null {
  return useSyncExternalStore(noop, detect, () => null);
}
