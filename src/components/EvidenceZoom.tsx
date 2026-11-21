/**
 * The evidence-on-screen component (Rule #1).
 *
 * Shows the actual research screenshot, then animates a ZOOM-IN to the exact
 * region where the claim lives (zoom coords come from sources.json). A
 * citation ribbon + "Verified source" badge keeps us honest.
 *
 * Hard rule: if the source is NOT verified, we DO NOT show the screenshot —
 * we show an explicit "evidence pending verification" card instead, so an
 * unverified claim can never masquerade as proof.
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { getSource, sourceImage } from "../lib/evidence";
import { theme } from "../lib/theme";
import { RoughRect, RoughLayer } from "../lib/rough";

export const EvidenceZoom: React.FC<{
  sourceId: string;
  /** frames: hold wide, then zoom */
  zoomStart?: number;
  zoomDuration?: number;
}> = ({ sourceId, zoomStart = 24, zoomDuration = 40 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const src = getSource(sourceId);
  const z = src.zoom ?? { x: 0.5, y: 0.4, scale: 2 };

  const t = interpolate(frame, [zoomStart, zoomStart + zoomDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(t, [0, 1], [1, z.scale]);
  // translate so the zoom focal point stays centered
  const tx = interpolate(t, [0, 1], [0, (0.5 - z.x) * width * z.scale]);
  const ty = interpolate(t, [0, 1], [0, (0.5 - z.y) * height * z.scale]);

  const cardIn = spring({ frame, fps, config: { damping: 16 } });

  if (!src.verified) {
    return (
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: 1100,
            padding: 60,
            textAlign: "center",
            fontFamily: theme.fontBody,
            color: theme.inkSoft,
            border: `4px dashed ${theme.inkSoft}`,
            borderRadius: 24,
            background: "rgba(255,255,255,0.5)",
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 800, color: theme.ink }}>Evidence pending verification</div>
          <div style={{ fontSize: 28, marginTop: 16 }}>
            {src.citation}
          </div>
          <div style={{ fontSize: 22, marginTop: 16, fontStyle: "italic" }}>
            (This claim is withheld from screen until its source screenshot is captured &amp; hash-verified.)
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      {/* framed screenshot with zoom */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
        <div
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            transformOrigin: "center center",
            transition: "none",
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
            background: "#fff",
            width: 1200,
            maxHeight: 900,
          }}
        >
          <Img src={sourceImage(sourceId)} style={{ width: "100%", display: "block" }} />
        </div>
      </AbsoluteFill>

      {/* highlight box on the focal region once zoomed */}
      {t > 0.6 && (
        <RoughLayer>
          <RoughRect
            x={width * 0.5 - 260}
            y={height * 0.5 - 90}
            w={520}
            h={180}
            stroke={theme.accents.anger}
            strokeWidth={4}
            seed={9}
          />
        </RoughLayer>
      )}

      {/* citation ribbon */}
      <div
        style={{
          position: "absolute",
          left: 60,
          bottom: 60,
          right: 60,
          transform: `translateY(${(1 - cardIn) * 40}px)`,
          opacity: cardIn,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            background: theme.accents.awe,
            color: "#fff",
            fontFamily: theme.fontBody,
            fontWeight: 800,
            fontSize: 24,
            padding: "8px 18px",
            borderRadius: 999,
            marginBottom: 12,
          }}
        >
          ✓ Verified source {src.openAccess ? "· open access" : ""}
        </div>
        <div
          style={{
            background: "rgba(42,42,51,0.92)",
            color: theme.paper,
            fontFamily: theme.fontBody,
            fontSize: 26,
            lineHeight: 1.35,
            padding: "16px 22px",
            borderRadius: 16,
          }}
        >
          {src.citation}
          {src.doi ? <div style={{ opacity: 0.8, fontSize: 22, marginTop: 6 }}>doi:{src.doi}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
