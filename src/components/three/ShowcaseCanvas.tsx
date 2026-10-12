"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RefObject, Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Variant } from "@/lib/products";
import { Carton } from "./Carton";
import { Studio } from "./Studio";
import { createShadowTexture } from "./coconutTextures";

export type Control = {
  /** accumulated user rotation (radians) */
  rotY: number;
  rotX: number;
  velocity: number;
  dragging: boolean;
  /** preset target, or null for free spin */
  target: number | null;
};

const SWAP_DURATION = 0.9;

function Product({ variant, controlRef, still }: { variant: Variant; controlRef: RefObject<Control>; still: boolean }) {
  const group = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const shadowTex = useMemo(() => createShadowTexture(), []);
  const [shown, setShown] = useState(variant);
  const swap = useRef<{ start: number; swapped: boolean } | null>(null);

  // A new variant kicks off a spin-and-dip transition; the texture swaps at the midpoint.
  useEffect(() => {
    if (variant.id === shown.id) return;
    swap.current = { start: -1, swapped: false };
  }, [variant, shown.id]);

  useFrame((state, rawDt) => {
    const g = group.current;
    const control = controlRef.current;
    if (!g || !control) return;
    const dt = Math.min(rawDt, 1 / 8);
    const t = still ? 0 : state.clock.elapsedTime;

    let extraSpin = 0;
    let dip = 0;
    if (swap.current) {
      if (swap.current.start < 0) swap.current.start = state.clock.elapsedTime;
      const k = Math.min(1, (state.clock.elapsedTime - swap.current.start) / SWAP_DURATION);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      extraSpin = e * Math.PI * 2;
      dip = Math.sin(k * Math.PI);
      if (k >= 0.5 && !swap.current.swapped) {
        swap.current.swapped = true;
        setShown(variant);
      }
      if (k >= 1) swap.current = null;
    }

    if (!control.dragging) {
      if (control.target !== null) {
        // ease the shortest way to the preset angle
        const diff = Math.atan2(Math.sin(control.target - control.rotY), Math.cos(control.target - control.rotY));
        control.rotY += diff * Math.min(1, dt * 5);
        control.velocity = 0;
        if (Math.abs(diff) < 0.001) control.target = null;
      } else {
        control.rotY += control.velocity * dt;
        control.velocity = THREE.MathUtils.damp(control.velocity, still ? 0 : 0.25, 2.5, dt);
      }
      control.rotX = THREE.MathUtils.damp(control.rotX, 0, 3, dt);
    }

    g.rotation.y = control.rotY + extraSpin;
    g.rotation.x = control.rotX + 0.05;
    g.rotation.z = Math.sin(t * 0.7) * 0.02;
    g.position.y = Math.sin(t * 0.9) * 0.05 + dip * 0.25;
    g.scale.setScalar(1 - dip * 0.12);

    if (shadow.current) {
      const m = shadow.current.material as THREE.MeshBasicMaterial;
      const lift = g.position.y;
      shadow.current.scale.set(2.3 - lift * 1.6, 0.6 - lift * 0.4, 1);
      m.opacity = 0.6 - lift * 0.8;
    }
  });

  return (
    <>
      <group ref={group}>
        <Carton variant={shown} />
      </group>
      <mesh ref={shadow} rotation-x={-Math.PI / 2} position={[0, -1.25, 0]}>
        <planeGeometry />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
      </mesh>
    </>
  );
}

export default function ShowcaseCanvas({
  variant,
  controlRef,
  active,
  still = false,
}: {
  variant: Variant;
  controlRef: RefObject<Control>;
  active: boolean;
  still?: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.35, 6.4], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl, camera }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1.1;
        camera.lookAt(0, 0, 0);
      }}
    >
      <Suspense fallback={null}>
        <Studio warm={1} />
        <Product variant={variant} controlRef={controlRef} still={still} />
      </Suspense>
    </Canvas>
  );
}
