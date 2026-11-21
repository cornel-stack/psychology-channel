/**
 * A single fast-cut image shot on the white canvas, with Ken Burns motion and
 * a required CC credit line. Full-bleed (cinematic) or a centered card. Falls
 * back to a word card if the image is missing, so the render never breaks.
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, Easing } from "remotion";
import { imagePath, hasImage, creditLine } from "../lib/images";
import { theme } from "../lib/theme";
import type { Motion } from "../videos/feelings-you-cant-name/shots";
import { WordShot } from "./WordShot";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const ImageShot: React.FC<{
  id: string;
  durationInFrames: number;
  label?: string;
  sub?: string;
  motion?: Motion;
  full?: boolean;
}> = ({ id, durationInFrames, label, sub, motion = "in", full = false }) => {
  const frame = useCurrentFrame();

  if (!hasImage(id)) {
    return <WordShot text={label ?? ""} sub={sub} />;
  }

  const p = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) });
  const scale = motion === "out" ? lerp(1.18, 1.06, p) : lerp(1.07, 1.19, p);
  const tx = motion === "left" ? lerp(0, -4, p) : motion === "right" ? lerp(0, 4, p) : 0;
  const ty = motion === "up" ? lerp(0, -4, p) : motion === "down" ? lerp(0, 4, p) : 0;
  const fade = interpolate(frame, [0, 4], [0, 1], { extrapolateRight: "clamp" });

  const image = (
    <Img
      src={imagePath(id)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: `translate(${tx}%, ${ty}%) scale(${scale})`,
      }}
    />
  );

  return (
    <AbsoluteFill style={{ backgroundColor: theme.paper, opacity: fade }}>
      {full ? (
        <AbsoluteFill style={{ overflow: "hidden" }}>{image}</AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 70 }}>
          <div
            style={{
              width: 1500,
              height: 840,
              borderRadius: 26,
              overflow: "hidden",
              boxShadow: "0 30px 70px rgba(0,0,0,0.22)",
              background: "#eee",
            }}
          >
            {image}
          </div>
        </AbsoluteFill>
      )}

      {/* bold word label */}
      {label ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: full ? 150 : 150, textAlign: "center" }}>
          <span
            style={{
              fontFamily: theme.fontBody,
              fontWeight: 900,
              fontSize: 86,
              color: "#fff",
              background: "rgba(10,10,14,0.72)",
              padding: "10px 34px",
              borderRadius: 14,
              letterSpacing: -1,
            }}
          >
            {label}
          </span>
          {sub ? (
            <div
              style={{
                marginTop: 16,
                fontFamily: theme.fontBody,
                fontWeight: 700,
                fontSize: 36,
                color: "#fff",
                textShadow: "0 2px 10px rgba(0,0,0,0.6)",
              }}
            >
              {sub}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* CC credit (required for BY/BY-SA; shown for all) */}
      <div
        style={{
          position: "absolute",
          left: 28,
          bottom: 20,
          fontFamily: theme.fontBody,
          fontSize: 18,
          color: full ? "rgba(255,255,255,0.8)" : theme.inkSoft,
          textShadow: full ? "0 1px 4px rgba(0,0,0,0.7)" : "none",
        }}
      >
        {creditLine(id)}
      </div>
    </AbsoluteFill>
  );
};
