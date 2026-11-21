/**
 * The "Napkin / white canvas" (Rule #6): a warm paper backdrop with a subtle
 * grain + a faint margin rule, so every scene feels drawn on the same napkin.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../lib/theme";

export const NapkinCanvas: React.FC<{ children: React.ReactNode; vignette?: boolean }> = ({
  children,
  vignette = true,
}) => (
  <AbsoluteFill style={{ backgroundColor: theme.paper }}>
    {/* paper grain */}
    <svg style={{ position: "absolute", inset: 0, opacity: 0.05 }} width="100%" height="100%">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
    {/* faint napkin fold / margin */}
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 0,
        bottom: 0,
        width: 2,
        background: theme.paperShadow,
        opacity: 0.6,
      }}
    />
    {vignette && (
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 300px rgba(120,100,60,0.12)",
          pointerEvents: "none",
        }}
      />
    )}
    {children}
  </AbsoluteFill>
);
