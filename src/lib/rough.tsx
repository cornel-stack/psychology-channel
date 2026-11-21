/**
 * rough.js helpers (Rule #3) — hand-drawn SVG primitives that render
 * deterministically in Remotion. rough.js uses randomness for its sketchy
 * look, so we ALWAYS pass a fixed `seed` to keep frames identical across the
 * render (otherwise the drawing would jitter frame-to-frame on CI).
 */
import React, { useMemo } from "react";
import rough from "roughjs";
import { theme } from "./theme";

type Common = {
  seed?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  fillStyle?: "hachure" | "solid" | "zigzag" | "cross-hatch" | "dots";
  roughness?: number;
};

const useGenerator = () => useMemo(() => rough.generator(), []);

const Drawable: React.FC<{ drawable: ReturnType<ReturnType<typeof rough.generator>["rectangle"]> }> = ({
  drawable,
}) => {
  const gen = rough.generator();
  const info = gen.toPaths(drawable);
  return (
    <>
      {info.map((p, i) => (
        <path
          key={i}
          d={p.d}
          stroke={p.stroke}
          strokeWidth={p.strokeWidth}
          fill={p.fill || "none"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </>
  );
};

const opts = (o: Common) => ({
  seed: o.seed ?? 42,
  stroke: o.stroke ?? theme.ink,
  strokeWidth: o.strokeWidth ?? 3,
  fill: o.fill,
  fillStyle: o.fillStyle ?? "hachure",
  fillWeight: 2,
  roughness: o.roughness ?? 1.4,
  bowing: 1,
});

export const RoughRect: React.FC<Common & { x: number; y: number; w: number; h: number }> = (p) => {
  const gen = useGenerator();
  const d = useMemo(() => gen.rectangle(p.x, p.y, p.w, p.h, opts(p)), [gen, p]);
  return <Drawable drawable={d} />;
};

export const RoughLine: React.FC<Common & { x1: number; y1: number; x2: number; y2: number }> = (p) => {
  const gen = useGenerator();
  const d = useMemo(() => gen.line(p.x1, p.y1, p.x2, p.y2, opts(p)), [gen, p]);
  return <Drawable drawable={d} />;
};

export const RoughEllipse: React.FC<Common & { cx: number; cy: number; w: number; h: number }> = (p) => {
  const gen = useGenerator();
  const d = useMemo(() => gen.ellipse(p.cx, p.cy, p.w, p.h, opts(p)), [gen, p]);
  return <Drawable drawable={d} />;
};

export const RoughCircle: React.FC<Common & { cx: number; cy: number; d: number }> = (p) => {
  const gen = useGenerator();
  const dr = useMemo(() => gen.circle(p.cx, p.cy, p.d, opts(p)), [gen, p]);
  return <Drawable drawable={dr} />;
};

export const RoughPath: React.FC<Common & { d: string }> = (p) => {
  const gen = useGenerator();
  const dr = useMemo(() => gen.path(p.d, opts(p)), [gen, p]);
  return <Drawable drawable={dr} />;
};

/** Convenience wrapper: a full-bleed SVG layer sized to the composition. */
export const RoughLayer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    width={theme.width}
    height={theme.height}
    viewBox={`0 0 ${theme.width} ${theme.height}`}
    style={{ position: "absolute", inset: 0 }}
  >
    {children}
  </svg>
);
