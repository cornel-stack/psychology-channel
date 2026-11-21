/**
 * Honest citation card for paywalled sources we can't legally screenshot.
 * Shows the verbatim quote + full citation + DOI — clearly a citation, not a
 * fabricated "paper screenshot". Used for sourceType "cite".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { getSource } from "../lib/evidence";
import { theme } from "../lib/theme";

export const CitationCard: React.FC<{ sourceId: string }> = ({ sourceId }) => {
  const src = getSource(sourceId);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = spring({ frame, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: 1280,
          background: "#fff",
          borderRadius: 22,
          padding: "56px 64px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
          borderTop: `10px solid ${theme.accents.awe}`,
          transform: `translateY(${(1 - inn) * 40}px) scale(${0.96 + inn * 0.04})`,
          opacity: inn,
          fontFamily: theme.fontBody,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span
            style={{
              background: theme.accents.awe,
              color: "#fff",
              fontWeight: 800,
              fontSize: 22,
              padding: "7px 16px",
              borderRadius: 999,
            }}
          >
            ✓ Peer-reviewed citation
          </span>
          <span style={{ color: theme.inkSoft, fontSize: 22 }}>
            (paywalled — quoted, not screenshotted)
          </span>
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 44,
            lineHeight: 1.3,
            color: theme.ink,
            fontWeight: 800,
            fontFamily: theme.fontTitle,
          }}
        >
          “{src.quote}”
        </div>
        {src.stat ? (
          <div style={{ marginTop: 20, fontSize: 30, color: theme.accents.anger, fontWeight: 800 }}>
            {src.stat}
          </div>
        ) : null}
        <div style={{ marginTop: 28, fontSize: 24, lineHeight: 1.45, color: theme.inkSoft }}>
          {src.citation}
          {src.doi ? <span style={{ display: "block", marginTop: 6 }}>doi:{src.doi}</span> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
