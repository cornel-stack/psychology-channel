/**
 * A big kinetic word card on the white canvas — the punchy text beats between
 * images (emotion names, key phrases). Hard-cut friendly with a quick pop.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { theme } from "../lib/theme";

export const WordShot: React.FC<{ text: string; sub?: string; accent?: string }> = ({
  text,
  sub,
  accent = theme.accents.anger,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 15, mass: 0.6 } });
  const y = interpolate(pop, [0, 1], [40, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.paper, justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <div style={{ transform: `translateY(${y}px) scale(${0.9 + pop * 0.1})`, opacity: pop, padding: "0 160px" }}>
        <div
          style={{
            fontFamily: theme.fontBody,
            fontWeight: 900,
            fontSize: text.length > 22 ? 96 : 128,
            lineHeight: 1.02,
            letterSpacing: -2,
            color: theme.ink,
          }}
        >
          {text}
        </div>
        {sub ? (
          <div
            style={{
              marginTop: 24,
              fontFamily: theme.fontBody,
              fontWeight: 800,
              fontSize: 52,
              color: accent,
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
