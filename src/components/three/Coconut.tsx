"use client";

import { forwardRef, useMemo } from "react";
import * as THREE from "three";
import { createCutTexture, createShellTextures, mulberry32 } from "./coconutTextures";

const HOLLOW = 0.66; // radius of the water cavity, as a fraction of the shell
const HEIGHT = 1.12; // coconuts are slightly taller than wide

type Assets = ReturnType<typeof buildAssets>;
let shared: Assets | null = null;

/** Lightweight value-noise on a sphere direction — enough for organic lumps. */
function lump(x: number, y: number, z: number) {
  return (
    Math.sin(x * 3.1 + y * 1.7) * 0.5 +
    Math.sin(y * 4.3 - z * 2.3) * 0.3 +
    Math.sin(z * 5.9 + x * 3.7) * 0.2
  );
}

function buildAssets() {
  const { map, bumpMap } = createShellTextures(2048);
  const cut = createCutTexture(HOLLOW / 2);

  // Outer dome, cut plane at y = 0, displaced away from the rim.
  const outer = new THREE.SphereGeometry(1, 160, 80, 0, Math.PI * 2, 0, Math.PI / 2);
  const pos = outer.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const fade = Math.min(1, v.y / 0.22);
    const n = lump(v.x, v.y, v.z) * 0.035 * fade;
    // slight point at the germination end
    const tip = Math.pow(Math.max(0, v.y), 6) * 0.08;
    v.multiplyScalar(1 + n);
    v.y = v.y * HEIGHT + tip;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  outer.computeVertexNormals();

  const inner = new THREE.SphereGeometry(HOLLOW, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2);
  inner.scale(1, HEIGHT * 0.96, 1);

  const ring = new THREE.RingGeometry(HOLLOW, 1, 160, 1);
  ring.rotateX(Math.PI / 2); // normal points down (-y), towards the opening

  // Loose husk fibres sticking out of the shell — they sell the silhouette.
  const rand = mulberry32(99);
  const strands = 2600;
  const hairPos = new Float32Array(strands * 6);
  const hairCol = new Float32Array(strands * 6);
  const tone = new THREE.Color();
  for (let i = 0; i < strands; i++) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(1 - rand() * 0.9); // skip the rim
    const dir = new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta));
    const base = dir.clone().multiplyScalar(1 + lump(dir.x, dir.y, dir.z) * 0.035 * Math.min(1, dir.y / 0.22));
    base.y *= HEIGHT;
    const meridian = new THREE.Vector3(Math.cos(phi) * Math.cos(theta), -Math.sin(phi), Math.cos(phi) * Math.sin(theta));
    const len = 0.03 + rand() * rand() * 0.14;
    const tipV = base
      .clone()
      .addScaledVector(dir, len * (0.25 + rand() * 0.5))
      .addScaledVector(meridian, len * (rand() - 0.3));
    hairPos.set([base.x, base.y, base.z, tipV.x, tipV.y, tipV.z], i * 6);
    tone.set(["#6b4526", "#8a5e38", "#a47a4e", "#4a2e19"][Math.floor(rand() * 4)]);
    hairCol.set([tone.r * 0.7, tone.g * 0.7, tone.b * 0.7, tone.r, tone.g, tone.b], i * 6);
  }
  const hair = new THREE.BufferGeometry();
  hair.setAttribute("position", new THREE.BufferAttribute(hairPos, 3));
  hair.setAttribute("color", new THREE.BufferAttribute(hairCol, 3));

  const shellMat = new THREE.MeshStandardMaterial({
    map,
    bumpMap,
    bumpScale: 3,
    roughness: 0.95,
    metalness: 0,
    color: new THREE.Color("#c9a585"),
  });
  const cutMat = new THREE.MeshPhysicalMaterial({
    map: cut,
    roughness: 0.55,
    clearcoat: 0.25,
    clearcoatRoughness: 0.5,
    side: THREE.DoubleSide,
  });
  const fleshMat = new THREE.MeshPhysicalMaterial({
    color: "#f6f0e2",
    roughness: 0.32,
    clearcoat: 0.8,
    clearcoatRoughness: 0.25,
    sheen: 0.4,
    sheenColor: new THREE.Color("#fff6e0"),
    side: THREE.BackSide,
  });
  const hairMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.75 });

  return { outer, inner, ring, hair, shellMat, cutMat, fleshMat, hairMat };
}

function useCoconutAssets() {
  return useMemo(() => (shared ??= buildAssets()), []);
}

/** One half of a cut coconut: dome up, cut face at y = 0 looking down. */
export const CoconutHalf = forwardRef<THREE.Group, React.ComponentProps<"group">>(function CoconutHalf(props, ref) {
  const a = useCoconutAssets();
  return (
    <group ref={ref} {...props}>
      <mesh geometry={a.outer} material={a.shellMat} />
      <lineSegments geometry={a.hair} material={a.hairMat} />
      <mesh geometry={a.ring} material={a.cutMat} />
      <mesh geometry={a.inner} material={a.fleshMat} />
    </group>
  );
});
