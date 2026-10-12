"use client";

import { forwardRef, useMemo } from "react";
import * as THREE from "three";
import { CARTON, makeFaceCanvas, type Face } from "@/lib/cartonArt";
import type { Variant } from "@/lib/products";

const materialCache = new Map<string, THREE.Material[]>();

/** Box face order in three.js: +x, -x, +y, -y, +z, -z. */
const FACE_ORDER: Face[] = ["side", "sideAlt", "top", "bottom", "front", "back"];

export function cartonMaterials(v: Variant) {
  const hit = materialCache.get(v.id);
  if (hit) return hit;
  const mats = FACE_ORDER.map((face) => {
    const tex = new THREE.CanvasTexture(makeFaceCanvas(face, v, 2));
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return new THREE.MeshPhysicalMaterial({
      map: tex,
      roughness: 0.42,
      clearcoat: 0.35,
      clearcoatRoughness: 0.35,
    });
  });
  materialCache.set(v.id, mats);
  return mats;
}

let geo: { box: THREE.BoxGeometry; cap: THREE.CylinderGeometry; collar: THREE.CylinderGeometry; seam: THREE.BoxGeometry } | null =
  null;

function geometry() {
  return (geo ??= {
    box: new THREE.BoxGeometry(CARTON.w, CARTON.h, CARTON.d, 1, 1, 1),
    cap: new THREE.CylinderGeometry(0.17, 0.17, 0.16, 48),
    collar: new THREE.CylinderGeometry(0.2, 0.2, 0.04, 48),
    seam: new THREE.BoxGeometry(CARTON.w * 1.001, 0.035, CARTON.d * 0.08),
  });
}

const capMaterial = new THREE.MeshPhysicalMaterial({ color: "#f3e8d6", roughness: 0.35, clearcoat: 0.4 });

type Props = React.ComponentProps<"group"> & { variant: Variant };

/** Tetra-prisma style carton with screw cap. Origin at the carton's centre. */
export const Carton = forwardRef<THREE.Group, Props>(function Carton({ variant, ...props }, ref) {
  const g = geometry();
  const mats = useMemo(() => cartonMaterials(variant), [variant]);
  const capMat = useMemo(() => {
    const m = capMaterial.clone();
    m.color.set(variant.accent === "#fbfaf6" ? "#3b2415" : variant.accent);
    return m;
  }, [variant]);

  return (
    <group ref={ref} {...props}>
      <mesh geometry={g.box} material={mats} />
      {/* folded top seam */}
      <mesh geometry={g.seam} material={mats[2]} position={[0, CARTON.h / 2 + 0.017, 0]} />
      <mesh geometry={g.collar} material={capMat} position={[0.22, CARTON.h / 2 + 0.02, 0.05]} />
      <mesh geometry={g.cap} material={capMat} position={[0.22, CARTON.h / 2 + 0.1, 0.05]} />
    </group>
  );
});
