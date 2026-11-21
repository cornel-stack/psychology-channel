/**
 * Stage = a clean WHITE canvas (Brainosophic-style). Kept the old name so
 * existing imports don't break. Optional faint accent wash for depth.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../lib/theme";

export const NapkinCanvas: React.FC<{ children: React.ReactNode; vignette?: boolean; tint?: string }> = ({
  children,
  tint,
}) => (
  <AbsoluteFill style={{ backgroundColor: theme.paper }}>
    {tint ? (
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 42%, ${tint}22 0%, rgba(255,255,255,0) 60%)`,
        }}
      />
    ) : null}
    {children}
  </AbsoluteFill>
);

export const Stage = NapkinCanvas;
