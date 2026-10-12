"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { BEATS, easeInOut, range, story } from "@/lib/story";
import { VARIANTS } from "@/lib/products";
import { CoconutHalf } from "./Coconut";
import { Carton } from "./Carton";
import { Studio } from "./Studio";
import { createShadowTexture } from "./coconutTextures";

const damp = THREE.MathUtils.damp;

type Pose = { x: number; y: number; z: number; rx: number; ry: number; rz: number; s: number };
const pose = (): Pose => ({ x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1 });

function approach(obj: THREE.Object3D, target: Pose, cur: Pose, lambda: number, dt: number) {
  (Object.keys(target) as (keyof Pose)[]).forEach((k) => {
    cur[k] = damp(cur[k], target[k], lambda, dt);
  });
  obj.position.set(cur.x, cur.y, cur.z);
  obj.rotation.set(cur.rx, cur.ry, cur.rz);
  obj.scale.setScalar(Math.max(cur.s, 0.0001));
}

function Choreography({ still }: { still: boolean }) {
  const size = useThree((s) => s.size);
  const coconut = useRef<THREE.Group>(null);
  const top = useRef<THREE.Group>(null);
  const bottom = useRef<THREE.Group>(null);
  const topSpin = useRef<THREE.Group>(null);
  const bottomSpin = useRef<THREE.Group>(null);
  const carton = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);

  const poses = useRef({ coconut: pose(), top: pose(), bottom: pose(), carton: pose(), cam: pose() });
  const shadowTex = useMemo(() => createShadowTexture(), []);
  const first = useRef(true);

  useFrame((three, rawDt) => {
    // First frame snaps straight to the pose for the current scroll position;
    // afterwards everything eases. The clamp only guards against tab-switch jumps.
    const dt = first.current ? 10 : Math.min(rawDt, 1 / 8);
    first.current = false;
    const state = poses.current;
    const camera = three.camera;
    const t = still ? 0 : three.clock.elapsedTime;
    const p = story.progress;
    const aspect = size.width / size.height;
    // Narrow screens: shrink objects and pull the lateral spread in.
    // Portrait screens are limited by width, so objects stay larger but spread less.
    const portrait = aspect < 1;
    const fit = portrait ? THREE.MathUtils.clamp(aspect * 1.9, 0.8, 0.95) : THREE.MathUtils.clamp(aspect / 1.45, 0.8, 1);
    const spread = portrait ? THREE.MathUtils.clamp(aspect * 0.9, 0.38, 0.6) : THREE.MathUtils.clamp(aspect / 1.6, 0.6, 1);

    const open = easeInOut(range(p, 0.0, 0.3)); // halves part and tilt toward camera
    const split = easeInOut(range(p, BEATS.cartonIn[0], BEATS.cartonIn[1])); // halves fly to the corners
    const leave = easeInOut(range(p, BEATS.yellowIn[0] - 0.05, BEATS.yellowIn[1])); // halves exit
    const rise = easeInOut(range(p, BEATS.cartonIn[0] + 0.02, BEATS.cartonIn[1] + 0.02));
    const turn = easeInOut(range(p, 0.54, 0.74)); // full product turn between brown and yellow
    const brand = easeInOut(range(p, BEATS.palmo[0], BEATS.palmo[1]));
    const floatY = Math.sin(t * 0.9) * 0.05;

    // --- Coconut (whole group) — a slow orbit that never hides the cut faces
    const c = pose();
    c.y = -0.72 + open * 0.62 + floatY;
    c.s = fit * (0.7 + open * 0.1 - split * 0.06);
    c.rx = story.pointerY * 0.06;
    c.ry = -0.3 + open * 0.65 - split * 0.3 + story.pointerX * 0.14;
    c.rz = 0.06 - open * 0.1;
    approach(coconut.current!, c, state.coconut, 6, dt);

    // True rotation about each half's own axis — fibres and lumps sell it.
    const spin = p * Math.PI * 2.4 + t * 0.12;
    topSpin.current!.rotation.y = spin;
    bottomSpin.current!.rotation.y = -spin * 0.8;

    // --- Halves ------------------------------------------------------------
    const tp = pose();
    tp.y = 0.42 + open * 0.55 + split * 1.2 * spread + leave * 3.6;
    tp.x = -split * 2.7 * spread - leave * 2.8;
    tp.z = -split * 0.4;
    tp.rx = -0.72 - open * 0.55 - split * 1.1 + Math.sin(t * 0.7) * 0.03;
    tp.rz = 0.2 + open * 0.1 + split * 0.6;
    tp.s = 1 - split * 0.25;
    approach(top.current!, tp, state.top, 6, dt);

    const bt = pose();
    bt.y = -0.08 - open * 0.25 - split * 1.25 * spread - leave * 3.6;
    bt.x = split * 2.8 * spread + leave * 2.8;
    bt.z = -split * 0.3;
    bt.rx = Math.PI + 0.38 + open * 0.3 + split * 0.5;
    bt.rz = -0.08 - split * 0.5;
    bt.s = 1 - split * 0.25;
    approach(bottom.current!, bt, state.bottom, 6, dt);

    coconut.current!.visible = leave < 0.999;

    // --- Carton ------------------------------------------------------------
    const k = pose();
    k.y = -4.8 * (1 - rise) + floatY * 1.4 - brand * 0.12;
    k.z = 0.3 * rise;
    k.ry =
      -Math.PI * 1.35 * (1 - rise) + 0.3 + turn * Math.PI * 2 + Math.sin(t * 0.6) * 0.06 + story.pointerX * 0.18;
    k.rx = 0.06 * rise + story.pointerY * 0.05;
    k.rz = 0.35 * (1 - rise) - 0.06 + Math.sin(t * 0.8) * 0.02;
    k.s = (portrait ? 0.66 : fit) * (1 - brand * 0.06);
    approach(carton.current!, k, state.carton, 5, dt);
    carton.current!.visible = rise > 0.001;

    // Shadow follows the carton, only once it has landed
    if (shadow.current) {
      const m = shadow.current.material as THREE.MeshBasicMaterial;
      const landed = Math.pow(range(rise, 0.7, 1), 2);
      const lift = 1 - Math.abs(floatY) * 3;
      shadow.current.position.set(0, state.carton.y - 1.2 * state.carton.s, 0);
      shadow.current.scale.set(2 * state.carton.s * lift, 0.5 * state.carton.s, 1);
      m.opacity = landed * 0.5 * lift;
    }

    // --- Camera: dolly down and around as the coconut opens --------------
    const cam = pose();
    cam.x = Math.sin(open * Math.PI) * 0.8 - split * 0.4 + brand * 0.25;
    cam.y = 1.2 - open * 0.9 + split * 0.1;
    cam.z = 8.4 - open * 0.9 + split * 0.6 - brand * 0.3;
    state.cam.x = damp(state.cam.x, cam.x, 4, dt);
    state.cam.y = damp(state.cam.y, cam.y, 4, dt);
    state.cam.z = damp(state.cam.z, cam.z, 4, dt);
    camera.position.set(state.cam.x, state.cam.y, state.cam.z);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <group ref={coconut}>
        <group ref={top}>
          <group ref={topSpin}>
            <CoconutHalf />
          </group>
        </group>
        <group ref={bottom}>
          <group ref={bottomSpin}>
            <CoconutHalf />
          </group>
        </group>
      </group>
      <mesh ref={shadow} rotation-x={-Math.PI / 2}>
        <planeGeometry />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} opacity={0} />
      </mesh>
      <Carton ref={carton} variant={VARIANTS[0]} visible={false} />
    </>
  );
}

export default function StoryCanvas({ active, still = false }: { active: boolean; still?: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.1, 8.4], fov: 30, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
    >
      <Suspense fallback={null}>
        <Studio />
        <Choreography still={still} />
      </Suspense>
    </Canvas>
  );
}
