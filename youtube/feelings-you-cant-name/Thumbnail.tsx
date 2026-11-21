/**
 * Clickbait thumbnail (Rule #7) — rendered as a Remotion still at 1280x720.
 * Big face, a bold emotional claim, high contrast, and a "you've felt this"
 * curiosity gap. Two variants via the `variant` prop for A/B testing.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { NapkinCanvas } from "../../src/components/NapkinCanvas";
import { EmotionFigure } from "../../src/components/EmotionFigure";
import { theme } from "../../src/lib/theme";
import { RoughLayer, RoughCircle } from "../../src/lib/rough";

export const Thumbnail: React.FC<{ variant?: "A" | "B" }> = ({ variant = "A" }) => {
  const headline = variant === "A" ? ["FEELINGS", "YOU CAN'T", "NAME"] : ["YOU'VE FELT", "ALL", "27"];
  return (
    <AbsoluteFill>
      <NapkinCanvas vignette>
        {/* big arrow / circle call-out */}
        <RoughLayer>
          <RoughCircle cx={1000} cy={360} d={520} stroke={theme.accents.anger} strokeWidth={10} seed={11} />
        </RoughLayer>

        {/* headline block */}
        <div style={{ position: "absolute", left: 70, top: 70 }}>
          {headline.map((line, i) => (
            <div
              key={i}
              style={{
                fontFamily: theme.fontBody,
                fontWeight: 900,
                fontSize: 150,
                lineHeight: 0.92,
                color: i === headline.length - 1 ? theme.accents.anger : theme.ink,
                textShadow: "4px 4px 0 rgba(0,0,0,0.08)",
                letterSpacing: -2,
              }}
            >
              {line}
            </div>
          ))}
          <div
            style={{
              marginTop: 24,
              display: "inline-block",
              background: theme.ink,
              color: theme.paper,
              fontFamily: theme.fontBody,
              fontWeight: 800,
              fontSize: 40,
              padding: "10px 24px",
              borderRadius: 12,
              transform: "rotate(-3deg)",
            }}
          >
            backed by real science ✓
          </div>
        </div>

        {/* the face doing the feeling */}
        <EmotionFigure emotion="awe" action="idle" accent="fear" x={820} y={120} scale={1.0} seed={3} animateIn={false} />
      </NapkinCanvas>
    </AbsoluteFill>
  );
};
