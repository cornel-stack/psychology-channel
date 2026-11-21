/**
 * Word-synced captions in the handwritten channel font. Pass the active line;
 * it fades/springs in. Keeps the video watchable with sound off (most of
 * YouTube's feed autoplay is muted).
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { theme } from "../lib/theme";

export const Caption: React.FC<{ text: string; accent?: string }> = ({ text, accent = theme.ink }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18 }, durationInFrames: 12 });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 90,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        padding: "0 160px",
      }}
    >
      <div
        style={{
          fontFamily: theme.fontBody,
          fontWeight: 800,
          fontSize: 54,
          lineHeight: 1.2,
          textAlign: "center",
          color: theme.ink,
          background: "rgba(251,247,239,0.82)",
          borderRadius: 20,
          padding: "14px 34px",
          boxShadow: "0 6px 0 rgba(0,0,0,0.05)",
          transform: `translateY(${(1 - enter) * 30}px)`,
          opacity: enter,
          borderBottom: `6px solid ${accent}`,
        }}
      >
        {text}
      </div>
    </div>
  );
};
