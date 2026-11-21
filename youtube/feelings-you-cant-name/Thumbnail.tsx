/**
 * Clickbait thumbnail (Rule #7) — a CC photo background + huge bold claim.
 * Two variants for A/B testing. No characters; matches the new image-led style.
 */
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { imagePath, hasImage } from "../../src/lib/images";
import { theme } from "../../src/lib/theme";

export const Thumbnail: React.FC<{ variant?: "A" | "B" }> = ({ variant = "A" }) => {
  const bg = variant === "A" ? "night-sky-stars" : "person-window-think";
  const headline = variant === "A" ? ["FEELINGS", "YOU CAN'T", "NAME"] : ["YOU'VE FELT", "ALL", "27"];
  return (
    <AbsoluteFill style={{ backgroundColor: theme.ink }}>
      {hasImage(bg) ? (
        <Img src={imagePath(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }} />
      ) : null}
      {/* dark gradient for text contrast */}
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.1) 100%)" }} />

      <div style={{ position: "absolute", left: 70, top: 64 }}>
        {headline.map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: theme.fontBody,
              fontWeight: 900,
              fontSize: 150,
              lineHeight: 0.9,
              color: i === headline.length - 1 ? "#ffd23f" : "#fff",
              letterSpacing: -3,
              textShadow: "0 6px 24px rgba(0,0,0,0.6)",
            }}
          >
            {line}
          </div>
        ))}
        <div
          style={{
            marginTop: 26,
            display: "inline-block",
            background: "#e03131",
            color: "#fff",
            fontFamily: theme.fontBody,
            fontWeight: 900,
            fontSize: 40,
            padding: "10px 26px",
            borderRadius: 12,
            transform: "rotate(-3deg)",
          }}
        >
          backed by real science ✓
        </div>
      </div>
    </AbsoluteFill>
  );
};
