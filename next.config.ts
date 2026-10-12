import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Three.js scenes mutate objects imperatively inside render loops; keep the
  // compiler off so it never memoises those mutations away.
  reactCompiler: false,
  turbopack: { root: __dirname },
};

export default nextConfig;
