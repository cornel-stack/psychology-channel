/**
 * An Open Peeps character brought to life: entrance spring, gentle breathing
 * bob, and a periodic blink — all deterministic (driven by useCurrentFrame).
 * Swap `emotion` to change the face on a story beat (same seed = same person).
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { peepSvg } from "../lib/peeps";
import type { Emotion } from "../videos/feelings-you-cant-name/script";

export const Peep: React.FC<{
  emotion?: Emotion;
  seed?: string;
  size?: number;
  x?: number;
  y?: number;
  flip?: boolean;
  animateIn?: boolean;
  delay?: number;
}> = ({ emotion = "calm", seed = "narrator", size = 460, x = 0, y = 0, flip = false, animateIn = true, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const svg = peepSvg(seed, emotion);

  const enter = animateIn ? spring({ frame: frame - delay, fps, config: { damping: 16 } }) : 1;
  const bob = Math.sin((frame / fps) * 2.0) * 5;
  // blink: quick vertical squash every ~3.2s
  const cycle = Math.round(fps * 3.2);
  const bf = frame % cycle;
  const blink = bf < 3 ? interpolate(bf, [0, 1.5, 3], [1, 0.1, 1]) : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `translateY(${(1 - enter) * 40 + bob}px) scale(${enter}) ${flip ? "scaleX(-1)" : ""}`,
        transformOrigin: "center bottom",
        opacity: enter,
      }}
    >
      <div
        style={{ width: "100%", height: "100%", transform: `scaleY(${blink})`, transformOrigin: "50% 42%" }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
};
