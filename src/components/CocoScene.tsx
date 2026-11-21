/**
 * "Figure doing an activity" illustration (Coco Material, CC0), Rule #2.
 * Renders a prefetched hand-drawn SVG with an entrance + gentle float, and a
 * "draw-on" stroke reveal. Falls back to nothing if the illustration is absent
 * (so the render never breaks if a tag wasn't found).
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COCO } from "../generated/coco";

export const CocoArt: React.FC<{
  name: string;
  size?: number;
  x?: number;
  y?: number;
  drawOn?: boolean;
  delay?: number;
}> = ({ name, size = 520, x = 0, y = 0, drawOn = true, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const svg = COCO[name];
  if (!svg) return null;

  const enter = spring({ frame: frame - delay, fps, config: { damping: 15 } });
  const float = Math.sin((frame / fps) * 1.6) * 8;
  const dash = interpolate(frame - delay, [0, 45], [1400, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `translateY(${(1 - enter) * 50 + float}px) scale(${0.85 + enter * 0.15})`,
        opacity: enter,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {drawOn ? <style>{`.coco-${cssId(name)} path{stroke-dasharray:1400;stroke-dashoffset:${dash};}`}</style> : null}
      <div
        className={`coco-${cssId(name)}`}
        style={{ width: "100%", height: "100%" }}
        dangerouslySetInnerHTML={{ __html: sizeSvg(svg) }}
      />
    </div>
  );
};

const cssId = (s: string) => s.replace(/[^a-z0-9]/gi, "");

// force the inlined SVG to fill its box
const sizeSvg = (svg: string) =>
  svg.replace("<svg", '<svg preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%"');
