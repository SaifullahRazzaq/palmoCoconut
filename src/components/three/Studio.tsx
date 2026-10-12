"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Soft product-photography lighting built entirely from in-scene light
 * formers — no HDR download, rendered to the env map once.
 */
export function Studio({ warm = 0 }: { warm?: number }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3.5, 5, 4]} intensity={2.1} color="#fff4e2" />
      <directionalLight position={[-4, 1.5, -2]} intensity={0.7} color={warm ? "#ffd9a0" : "#e8eefc"} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[8, 3, 1]} color="#fffaf0" />
        <Lightformer form="rect" intensity={1.6} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="ring" intensity={2.2} position={[4, 2, 2]} scale={2} color="#ffe7b0" />
        <Lightformer form="rect" intensity={0.6} position={[0, -3, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} color="#8a5a36" />
      </Environment>
    </>
  );
}
