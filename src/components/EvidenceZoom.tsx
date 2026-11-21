/**
 * Evidence on screen (Rule #1, accurate). Shows the real paper and zooms to the
 * EXACT rectangle of the supporting quote (from sources.json `locator`, computed
 * by pdftotext/DOM geometry — never a guess). The verbatim quote is shown and
 * the located sentence is highlighted in place.
 *
 * For `cite` sources (paywalled) there is no screenshot — a CitationCard renders
 * instead. Unverified sources are withheld entirely.
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Easing,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { getSource, sourceImage, canZoom, EvidenceSource } from "../lib/evidence";
import { theme } from "../lib/theme";
import { CitationCard } from "./CitationCard";

const PANEL = { x: 70, y: 150, w: 980, h: 820 }; // paper viewport on the left

const Badge: React.FC<{ src: EvidenceSource }> = ({ src }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      background: theme.accents.awe,
      color: "#fff",
      fontFamily: theme.fontBody,
      fontWeight: 800,
      fontSize: 22,
      padding: "7px 16px",
      borderRadius: 999,
    }}
  >
    ✓ Verified source{src.openAccess ? " · open access" : ""}
  </div>
);

export const EvidenceZoom: React.FC<{ sourceId: string; zoomStart?: number; zoomDur?: number }> = ({
  sourceId,
  zoomStart = 30,
  zoomDur = 45,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const src = getSource(sourceId);

  if (!canZoom(src)) return <CitationCard sourceId={sourceId} />;

  const imgW = src.imgW!;
  const imgH = src.imgH!;
  const loc = src.locator!;

  // contain the page in the panel
  const base = Math.min(PANEL.w / imgW, PANEL.h / imgH);
  const off0 = { x: (PANEL.w - imgW * base) / 2, y: (PANEL.h - imgH * base) / 2 };

  // zoom target: the located quote rectangle, centered, filling the panel
  const lcx = (loc.x + loc.w / 2) * imgW;
  const lcy = (loc.y + loc.h / 2) * imgH;
  const zoom = Math.max(
    base * 1.5,
    Math.min(base * 6, Math.min((PANEL.w * 0.82) / (loc.w * imgW), (PANEL.h * 0.46) / (loc.h * imgH)))
  );
  const off1 = { x: PANEL.w / 2 - zoom * lcx, y: PANEL.h / 2 - zoom * lcy };

  const p = interpolate(frame, [zoomStart, zoomStart + zoomDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });
  const scale = base + (zoom - base) * p;
  const offX = off0.x + (off1.x - off0.x) * p;
  const offY = off0.y + (off1.y - off0.y) * p;

  const cardIn = spring({ frame: frame - 6, fps, config: { damping: 18 } });
  const hlOpacity = interpolate(p, [0.45, 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* paper viewport */}
      <div
        style={{
          position: "absolute",
          left: PANEL.x,
          top: PANEL.y,
          width: PANEL.w,
          height: PANEL.h,
          overflow: "hidden",
          borderRadius: 14,
          background: "#fff",
          boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: imgW,
            height: imgH,
            transform: `translate(${offX}px, ${offY}px) scale(${scale})`,
            transformOrigin: "0 0",
          }}
        >
          <Img src={sourceImage(sourceId)} style={{ width: imgW, height: imgH, display: "block" }} />
          {/* highlight the exact located quote, in image space */}
          <div
            style={{
              position: "absolute",
              left: loc.x * imgW - 6,
              top: loc.y * imgH - 4,
              width: loc.w * imgW + 12,
              height: loc.h * imgH + 8,
              background: "rgba(242,177,0,0.28)",
              borderBottom: `3px solid ${theme.accents.joy}`,
              boxShadow: `0 0 0 2px ${theme.accents.anger}`,
              opacity: hlOpacity,
            }}
          />
        </div>
      </div>

      {/* right-hand evidence panel */}
      <div
        style={{
          position: "absolute",
          left: 1110,
          top: 180,
          width: 740,
          transform: `translateY(${(1 - cardIn) * 30}px)`,
          opacity: cardIn,
          fontFamily: theme.fontBody,
        }}
      >
        <Badge src={src} />
        <div style={{ marginTop: 20, fontSize: 30, lineHeight: 1.3, color: theme.inkSoft }}>
          What the paper actually says:
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 34,
            lineHeight: 1.35,
            color: theme.ink,
            fontWeight: 700,
            borderLeft: `6px solid ${theme.accents.joy}`,
            paddingLeft: 20,
          }}
        >
          “{src.quote}”
        </div>
        {src.stat ? (
          <div style={{ marginTop: 22, fontSize: 28, color: theme.accents.anger, fontWeight: 800 }}>
            {src.stat}
          </div>
        ) : null}
        <div style={{ marginTop: 26, fontSize: 22, lineHeight: 1.4, color: theme.inkSoft }}>
          {src.citation}
          {src.doi ? <div style={{ marginTop: 6 }}>doi:{src.doi}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
