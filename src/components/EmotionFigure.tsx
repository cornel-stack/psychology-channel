/**
 * A hand-drawn, emotion-expressing stick/doodle figure (Rule #2, free path).
 *
 * The research agent confirmed there is NO mature free 2D rigged-character lib
 * with emotion + body states — so this is our own lightweight SVG puppet,
 * styled with rough.js, driven by Remotion's spring/interpolate. It supports
 * emotions (sad/joy/fear/anger/awe/neutral) and simple actions (sit/walk/idle)
 * via joint + face parameters. Upgrade path: swap for a VRM character
 * (see Character3D.tsx) for signature episodes.
 */
import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { RoughCircle, RoughLine, RoughPath, RoughEllipse } from "../lib/rough";
import { theme, AccentKey } from "../lib/theme";

export type Emotion = "neutral" | "sad" | "joy" | "fear" | "anger" | "awe";
export type Action = "idle" | "sit" | "walk";

const mouthFor = (e: Emotion, cx: number, cy: number): string => {
  switch (e) {
    case "joy":
      return `M ${cx - 22} ${cy} Q ${cx} ${cy + 28} ${cx + 22} ${cy}`;
    case "sad":
      return `M ${cx - 22} ${cy + 10} Q ${cx} ${cy - 16} ${cx + 22} ${cy + 10}`;
    case "fear":
      return `M ${cx - 14} ${cy + 2} Q ${cx} ${cy + 22} ${cx + 14} ${cy + 2} Q ${cx} ${cy - 10} ${cx - 14} ${cy + 2}`;
    case "anger":
      return `M ${cx - 20} ${cy + 8} Q ${cx} ${cy - 6} ${cx + 20} ${cy + 8}`;
    case "awe":
      return `M ${cx} ${cy + 4} m -12 0 a 12 16 0 1 0 24 0 a 12 16 0 1 0 -24 0`;
    default:
      return `M ${cx - 18} ${cy + 4} L ${cx + 18} ${cy + 4}`;
  }
};

const browFor = (e: Emotion, cx: number, cy: number, side: -1 | 1): string => {
  const x = cx + side * 26;
  switch (e) {
    case "anger":
      // inner-down angry brows (mirrored per side)
      return side === -1
        ? `M ${x - 14} ${cy - 6} L ${x + 14} ${cy + 4}`
        : `M ${x - 14} ${cy + 4} L ${x + 14} ${cy - 6}`;
    case "sad":
    case "fear":
      return `M ${x - 14} ${cy + 2} L ${x + 14} ${cy - 6}`;
    default:
      return `M ${x - 14} ${cy - 2} L ${x + 14} ${cy - 2}`;
  }
};

export const EmotionFigure: React.FC<{
  emotion?: Emotion;
  action?: Action;
  accent?: AccentKey;
  x?: number;
  y?: number;
  scale?: number;
  seed?: number;
  /** entry pop animation — disable for stills/thumbnails (rendered at frame 0). */
  animateIn?: boolean;
}> = ({ emotion = "neutral", action = "idle", accent = "calm", x = 0, y = 0, scale = 1, seed = 7, animateIn = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const color = theme.accents[accent];

  // gentle breathing / bob
  const bob = Math.sin((frame / fps) * 2.2) * 6;
  // walk cycle
  const walk = action === "walk" ? Math.sin((frame / fps) * 6) : 0;
  const stride = action === "walk" ? Math.cos((frame / fps) * 6) * 18 : 0;
  // enter spring (skipped for stills so the figure is visible at frame 0)
  const pop = animateIn ? spring({ frame, fps, config: { damping: 14 } }) : 1;
  const sit = action === "sit" ? 70 : 0;

  // local coords around a 400x600 figure box
  const headCx = 200;
  const headCy = 120 + bob + (emotion === "sad" ? 10 : 0);
  const hipY = 330 + sit;
  const droop = emotion === "sad" ? 18 : emotion === "fear" ? -6 : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${scale * pop})`,
        transformOrigin: "center bottom",
      }}
    >
      <svg width={400} height={640} viewBox="0 0 400 640">
        <RoughLayerInline>
          {/* head */}
          <RoughCircle cx={headCx} cy={headCy} d={130} seed={seed} stroke={theme.ink} />
          {/* eyes */}
          <RoughCircle cx={headCx - 26} cy={headCy - 6} d={emotion === "fear" ? 22 : 12} seed={seed + 1} fill={theme.ink} fillStyle="solid" />
          <RoughCircle cx={headCx + 26} cy={headCy - 6} d={emotion === "fear" ? 22 : 12} seed={seed + 2} fill={theme.ink} fillStyle="solid" />
          {/* brows */}
          <RoughPath d={browFor(emotion, headCx, headCy - 30, -1)} seed={seed + 3} strokeWidth={4} />
          <RoughPath d={browFor(emotion, headCx, headCy - 30, 1)} seed={seed + 4} strokeWidth={4} />
          {/* mouth */}
          <RoughPath d={mouthFor(emotion, headCx, headCy + 36)} seed={seed + 5} strokeWidth={4} />
          {/* body */}
          <RoughLine x1={headCx} y1={headCy + 65} x2={headCx} y2={hipY} seed={seed + 6} strokeWidth={4} stroke={color} />
          {/* arms */}
          <RoughLine
            x1={headCx}
            y1={headCy + 110}
            x2={headCx - 80 + droop}
            y2={emotion === "awe" ? headCy + 40 : headCy + 200 + droop}
            seed={seed + 7}
            strokeWidth={4}
            stroke={color}
          />
          <RoughLine
            x1={headCx}
            y1={headCy + 110}
            x2={headCx + 80 - droop}
            y2={emotion === "awe" ? headCy + 40 : headCy + 200 + droop}
            seed={seed + 8}
            strokeWidth={4}
            stroke={color}
          />
          {/* legs */}
          {action === "sit" ? (
            <>
              <RoughLine x1={headCx} y1={hipY} x2={headCx - 70} y2={hipY} seed={seed + 9} strokeWidth={4} stroke={color} />
              <RoughLine x1={headCx - 70} y1={hipY} x2={headCx - 70} y2={hipY + 110} seed={seed + 10} strokeWidth={4} stroke={color} />
              <RoughLine x1={headCx} y1={hipY} x2={headCx + 70} y2={hipY} seed={seed + 11} strokeWidth={4} stroke={color} />
              <RoughLine x1={headCx + 70} y1={hipY} x2={headCx + 70} y2={hipY + 110} seed={seed + 12} strokeWidth={4} stroke={color} />
            </>
          ) : (
            <>
              <RoughLine x1={headCx} y1={hipY} x2={headCx - 55 + stride} y2={hipY + 160} seed={seed + 9} strokeWidth={4} stroke={color} />
              <RoughLine x1={headCx} y1={hipY} x2={headCx + 55 - stride} y2={hipY + 160} seed={seed + 10} strokeWidth={4} stroke={color} />
            </>
          )}
          {/* a sad tear */}
          {emotion === "sad" && (
            <RoughEllipse cx={headCx + 30} cy={headCy + 24 + (frame % 40)} w={10} h={16} seed={seed + 13} fill={theme.accents.sadness} fillStyle="solid" stroke={theme.accents.sadness} />
          )}
        </RoughLayerInline>
      </svg>
      {/* walk subtle horizontal drift handled by parent if needed */}
      <span style={{ display: "none" }}>{walk}</span>
    </div>
  );
};

// local svg wrapper sized to the figure box
const RoughLayerInline: React.FC<{ children: React.ReactNode }> = ({ children }) => <g>{children}</g>;
