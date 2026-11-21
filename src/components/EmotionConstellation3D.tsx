/**
 * 3D segment (Rule #5): the 27 emotion categories from Cowen & Keltner (2017)
 * as a slowly orbiting constellation of glowing nodes connected by the
 * "continuous gradients" the paper describes. Pure three.js primitives, so it
 * renders on headless CI via @remotion/three with no model files.
 */
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import * as THREE from "three";
import { theme } from "../lib/theme";

const EMOTIONS_27 = [
  "Admiration", "Adoration", "Aesthetic Appreciation", "Amusement", "Anxiety",
  "Awe", "Awkwardness", "Boredom", "Calmness", "Confusion", "Craving", "Disgust",
  "Empathic Pain", "Entrancement", "Envy", "Excitement", "Fear", "Horror",
  "Interest", "Joy", "Nostalgia", "Romance", "Sadness", "Satisfaction",
  "Sexual Desire", "Sympathy", "Triumph",
];

const PALETTE = Object.values(theme.accents);

// Deterministic pseudo-random point on a sphere (no Math.random in render).
const nodePositions = (n: number, radius: number) =>
  Array.from({ length: n }, (_, i) => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius);
  });

const Nodes: React.FC = () => {
  const frame = useCurrentFrame();
  const positions = useMemo(() => nodePositions(EMOTIONS_27.length, 3.2), []);
  const pulse = 0.9 + Math.sin(frame / 10) * 0.1;

  return (
    <group rotation={[0, (frame / 300) * Math.PI, 0]}>
      {/* gradient links between neighbouring emotions */}
      {positions.map((p, i) => {
        const q = positions[(i + 1) % positions.length];
        const geom = new THREE.BufferGeometry().setFromPoints([p, q]);
        return (
          <primitive key={`l${i}`} object={new THREE.Line(geom, new THREE.LineBasicMaterial({ color: "#c9bfa8", transparent: true, opacity: 0.25 }))} />
        );
      })}
      {positions.map((p, i) => (
        <mesh key={i} position={p} scale={pulse}>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial
            color={PALETTE[i % PALETTE.length]}
            emissive={PALETTE[i % PALETTE.length]}
            emissiveIntensity={0.6}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};

export const EmotionConstellation3D: React.FC = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const camZ = interpolate(frame, [0, 90], [9, 7], { extrapolateRight: "clamp" });
  return (
    <ThreeCanvas
      width={width}
      height={height}
      style={{ backgroundColor: "transparent" }}
      camera={{ fov: 50, position: [0, 0, camZ] }}
    >
      <ambientLight intensity={0.8} />
      <pointLight position={[6, 6, 6]} intensity={1.2} />
      <pointLight position={[-6, -4, 4]} intensity={0.6} color={theme.accents.fear} />
      <Nodes />
    </ThreeCanvas>
  );
};
