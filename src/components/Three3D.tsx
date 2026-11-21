/**
 * Meaningful three.js 3D moments on the white canvas (Rule #5), via
 * @remotion/three. Deterministic (driven by useCurrentFrame; no Math.random).
 *
 *   globe         — a rotating globe with points lighting up worldwide
 *                   (the 2,474 languages, Jackson 2019)
 *   constellation — 27 emotion nodes blended by gradient links (Cowen & Keltner)
 *   brain         — a neural cluster whose "amygdala" node flares red then
 *                   calms (affect labeling, Lieberman)
 *
 * Renders on headless CI with --gl=swangle (software WebGL).
 */
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import * as THREE from "three";
import { theme } from "../lib/theme";

const PALETTE = Object.values(theme.accents);

const fib = (n: number, radius: number) =>
  Array.from({ length: n }, (_, i) => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    return new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r).multiplyScalar(radius);
  });

const Globe: React.FC = () => {
  const frame = useCurrentFrame();
  const pts = useMemo(() => fib(90, 2.35), []);
  return (
    <group rotation={[0.3, (frame / 260) * Math.PI, 0]}>
      <mesh>
        <sphereGeometry args={[2.3, 40, 40]} />
        <meshStandardMaterial color="#eef3f8" roughness={0.9} metalness={0} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.31, 24, 24]} />
        <meshBasicMaterial color="#9fb6c9" wireframe transparent opacity={0.35} />
      </mesh>
      {pts.map((p, i) => {
        const lit = (Math.sin(frame / 8 + i) + 1) / 2; // twinkle
        return (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.055 + lit * 0.03, 10, 10]} />
            <meshStandardMaterial color={theme.accents.awe} emissive={theme.accents.awe} emissiveIntensity={0.3 + lit} />
          </mesh>
        );
      })}
    </group>
  );
};

const Constellation: React.FC = () => {
  const frame = useCurrentFrame();
  const pts = useMemo(() => fib(27, 2.5), []);
  const pulse = 0.9 + Math.sin(frame / 10) * 0.1;
  return (
    <group rotation={[0, (frame / 300) * Math.PI, 0]}>
      {pts.map((p, i) => {
        const q = pts[(i + 1) % pts.length];
        const geom = new THREE.BufferGeometry().setFromPoints([p, q]);
        return (
          <primitive
            key={`l${i}`}
            object={new THREE.Line(geom, new THREE.LineBasicMaterial({ color: "#c9cdd6", transparent: true, opacity: 0.4 }))}
          />
        );
      })}
      {pts.map((p, i) => (
        <mesh key={i} position={p} scale={pulse}>
          <sphereGeometry args={[0.17, 20, 20]} />
          <meshStandardMaterial
            color={PALETTE[i % PALETTE.length]}
            emissive={PALETTE[i % PALETTE.length]}
            emissiveIntensity={0.55}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};

const Brain: React.FC = () => {
  const frame = useCurrentFrame();
  // squashed ellipsoid cluster = rough brain shape
  const pts = useMemo(
    () => fib(70, 2.2).map((v) => new THREE.Vector3(v.x * 1.25, v.y * 0.95, v.z * 1.0)),
    []
  );
  // amygdala flares red (alarm) then calms to blue over the shot
  const calm = interpolate(frame, [20, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const alarmColor = new THREE.Color(theme.accents.anger).lerp(new THREE.Color(theme.accents.sadness), calm);
  const flare = 0.6 + Math.sin(frame / 5) * 0.4 * (1 - calm);
  return (
    <group rotation={[0.2, (frame / 400) * Math.PI, 0]}>
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color="#d7b7c4" emissive="#c79" emissiveIntensity={0.15} />
        </mesh>
      ))}
      <mesh position={[1.0, -0.5, 0.9]} scale={1 + flare * 0.3}>
        <sphereGeometry args={[0.32, 20, 20]} />
        <meshStandardMaterial color={alarmColor} emissive={alarmColor} emissiveIntensity={0.6 + flare} />
      </mesh>
    </group>
  );
};

export const Three3D: React.FC<{ variant: "globe" | "constellation" | "brain"; label?: string }> = ({ variant, label }) => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.paper, opacity: fade }}>
      <ThreeCanvas width={width} height={height} style={{ backgroundColor: "transparent" }} camera={{ fov: 50, position: [0, 0, 7.5] }}>
        <ambientLight intensity={0.9} />
        <pointLight position={[6, 6, 8]} intensity={1.3} />
        <pointLight position={[-6, -3, 4]} intensity={0.5} color={theme.accents.fear} />
        {variant === "globe" ? <Globe /> : variant === "constellation" ? <Constellation /> : <Brain />}
      </ThreeCanvas>
      {label ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center" }}>
          <span
            style={{
              fontFamily: theme.fontBody,
              fontWeight: 900,
              fontSize: 64,
              color: theme.ink,
              background: "rgba(255,255,255,0.78)",
              padding: "8px 28px",
              borderRadius: 14,
            }}
          >
            {label}
          </span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
