import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Scene } from "../script";
import { theme } from "../../../lib/theme";
import { NapkinCanvas } from "../../../components/NapkinCanvas";
import { Peep } from "../../../components/Peep";
import { CocoArt } from "../../../components/CocoScene";
import { EvidenceZoom } from "../../../components/EvidenceZoom";
import { Caption } from "../../../components/Captions";

/** Soft accent blob for depth behind characters. */
const Blob: React.FC<{ color: string; x: number; y: number; r: number; o?: number }> = ({ color, x, y, r, o = 0.16 }) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: color,
      opacity: o,
      filter: "blur(10px)",
    }}
  />
);

export const CaptionTrack: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;
  const active = scene.cues.find((c) => sec >= c.from && sec < c.from + c.dur);
  if (!active) return null;
  return <Caption text={active.text} accent={theme.accents[scene.accent]} />;
};

const Kicker: React.FC<{ text: string; accent: string }> = ({ text, accent }) => (
  <div
    style={{
      position: "absolute",
      top: 66,
      left: 160,
      fontFamily: theme.fontBody,
      fontWeight: 900,
      fontSize: 28,
      letterSpacing: 3,
      textTransform: "uppercase",
      color: accent,
    }}
  >
    {text}
  </div>
);

export const ColdOpenScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tIn = spring({ frame, fps, config: { damping: 18 } });
  return (
    <NapkinCanvas>
      <Blob color={theme.accents[scene.accent]} x={1480} y={520} r={360} />
      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 160, paddingRight: 760 }}>
        <div
          style={{
            fontFamily: theme.fontTitle,
            fontSize: 132,
            lineHeight: 1.0,
            color: theme.ink,
            transform: `translateY(${(1 - tIn) * 40}px)`,
            opacity: tIn,
          }}
        >
          {scene.title}
        </div>
      </AbsoluteFill>
      <Peep emotion={scene.emotion} seed={scene.peepSeed} size={620} x={1180} y={300} />
      <CaptionTrack scene={scene} />
    </NapkinCanvas>
  );
};

export const BigTextScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = scene.bigText ?? [];
  return (
    <NapkinCanvas>
      <Blob color={theme.accents[scene.accent]} x={960} y={540} r={520} o={0.1} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div>
          {lines.map((line, i) => {
            const a = spring({ frame: frame - (6 + i * 10), fps, config: { damping: 15 } });
            const isLast = i === lines.length - 1;
            return (
              <div
                key={i}
                style={{
                  fontFamily: theme.fontBody,
                  fontWeight: 900,
                  fontSize: 104,
                  lineHeight: 1.04,
                  letterSpacing: -1,
                  color: isLast ? theme.accents[scene.accent] : theme.ink,
                  transform: `translateY(${(1 - a) * 40}px) scale(${0.9 + a * 0.1})`,
                  opacity: a,
                }}
              >
                {line}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <CaptionTrack scene={scene} />
    </NapkinCanvas>
  );
};

export const PeepScene: React.FC<{ scene: Scene }> = ({ scene }) => (
  <NapkinCanvas>
    <Blob color={theme.accents[scene.accent]} x={960} y={470} r={360} />
    <Peep emotion={scene.emotion} seed={scene.peepSeed} size={560} x={680} y={210} />
    <CaptionTrack scene={scene} />
  </NapkinCanvas>
);

export const CocoScene: React.FC<{ scene: Scene }> = ({ scene }) => (
  <NapkinCanvas>
    <Kicker text="In real life" accent={theme.accents[scene.accent]} />
    <Blob color={theme.accents[scene.accent]} x={1300} y={500} r={380} />
    {scene.coco ? <CocoArt name={scene.coco} size={660} x={1040} y={230} /> : null}
    <Peep emotion={scene.emotion ?? "explaining"} seed={scene.peepSeed} size={460} x={260} y={330} />
    <CaptionTrack scene={scene} />
  </NapkinCanvas>
);

export const EvidenceScene: React.FC<{ scene: Scene }> = ({ scene }) => (
  <NapkinCanvas vignette={false}>
    <Kicker text="The evidence" accent={theme.accents[scene.accent]} />
    <EvidenceZoom sourceId={scene.sourceId!} />
    <CaptionTrack scene={scene} />
  </NapkinCanvas>
);

export const WordCardsScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = scene.words ?? [];
  return (
    <NapkinCanvas>
      <Kicker text="Named elsewhere" accent={theme.accents[scene.accent]} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 22, paddingTop: 40 }}>
        {words.map((w, i) => {
          const a = spring({ frame: frame - (14 + i * 20), fps, config: { damping: 16 } });
          return (
            <div
              key={w.word}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                width: 1240,
                background: "rgba(255,255,255,0.78)",
                borderLeft: `12px solid ${theme.accents[scene.accent]}`,
                borderRadius: 18,
                padding: "18px 30px",
                transform: `translateX(${(1 - a) * -70}px)`,
                opacity: a,
                boxShadow: "0 8px 0 rgba(0,0,0,0.05)",
              }}
            >
              {w.coco ? (
                <div style={{ width: 92, height: 92, flexShrink: 0, position: "relative" }}>
                  <CocoArt name={w.coco} size={92} x={0} y={0} drawOn={false} delay={14 + i * 20} />
                </div>
              ) : null}
              <div>
                <div style={{ fontFamily: theme.fontTitle, fontSize: 60, color: theme.ink, lineHeight: 1 }}>
                  {w.word}{" "}
                  <span style={{ fontFamily: theme.fontBody, fontSize: 26, color: theme.inkSoft }}>· {w.lang}</span>
                </div>
                <div style={{ fontFamily: theme.fontBody, fontSize: 28, color: theme.ink, marginTop: 4 }}>{w.meaning}</div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <CaptionTrack scene={scene} />
    </NapkinCanvas>
  );
};

export const OutroScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 1 + Math.sin(frame / 8) * 0.03;
  const show = spring({ frame: frame - 26, fps, config: { damping: 14 } });
  return (
    <NapkinCanvas>
      <Blob color={theme.accents[scene.accent]} x={1480} y={520} r={340} />
      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 160, paddingRight: 720 }}>
        <div style={{ fontFamily: theme.fontTitle, fontSize: 104, color: theme.ink, lineHeight: 1.05 }}>
          You weren't broken.
          <br />
          You were under-worded.
        </div>
        <div
          style={{
            marginTop: 40,
            alignSelf: "flex-start",
            transform: `scale(${show * pulse})`,
            opacity: show,
            background: theme.accents.anger,
            color: "#fff",
            fontFamily: theme.fontBody,
            fontWeight: 900,
            fontSize: 44,
            padding: "16px 40px",
            borderRadius: 999,
          }}
        >
          ▶ Subscribe
        </div>
      </AbsoluteFill>
      <Peep emotion={scene.emotion} seed={scene.peepSeed} size={620} x={1200} y={300} />
      <CaptionTrack scene={scene} />
    </NapkinCanvas>
  );
};

export const renderScene = (scene: Scene) => {
  switch (scene.type) {
    case "cold-open":
      return <ColdOpenScene scene={scene} />;
    case "bigtext":
      return <BigTextScene scene={scene} />;
    case "peep":
      return <PeepScene scene={scene} />;
    case "coco":
      return <CocoScene scene={scene} />;
    case "evidence":
      return <EvidenceScene scene={scene} />;
    case "wordcards":
      return <WordCardsScene scene={scene} />;
    case "outro":
      return <OutroScene scene={scene} />;
  }
};
