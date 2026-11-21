import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Scene } from "../script";
import { theme } from "../../../lib/theme";
import { NapkinCanvas } from "../../../components/NapkinCanvas";
import { EmotionFigure } from "../../../components/EmotionFigure";
import { EvidenceZoom } from "../../../components/EvidenceZoom";
import { EmotionConstellation3D } from "../../../components/EmotionConstellation3D";
import { Caption } from "../../../components/Captions";
import { RoughLayer, RoughRect } from "../../../lib/rough";

/** Renders whichever caption cue is active for the current local frame. */
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
      top: 70,
      left: 160,
      fontFamily: theme.fontBody,
      fontWeight: 900,
      fontSize: 30,
      letterSpacing: 2,
      textTransform: "uppercase",
      color: accent,
    }}
  >
    {text}
  </div>
);

export const HookScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleIn = spring({ frame, fps, config: { damping: 16 } });
  const subIn = spring({ frame: frame - 18, fps, config: { damping: 14 } });
  return (
    <NapkinCanvas>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div
          style={{
            fontFamily: theme.fontTitle,
            fontSize: 150,
            color: theme.ink,
            transform: `scale(${titleIn})`,
            lineHeight: 1,
            maxWidth: 1500,
          }}
        >
          {scene.title}
        </div>
        <div
          style={{
            fontFamily: theme.fontBody,
            fontWeight: 900,
            fontSize: 64,
            color: theme.accents.anger,
            marginTop: 20,
            transform: `translateY(${(1 - subIn) * 30}px)`,
            opacity: subIn,
          }}
        >
          {scene.subtitle}
        </div>
      </AbsoluteFill>
      <EmotionFigure emotion={scene.emotion} action="idle" accent={scene.accent} x={1380} y={360} scale={0.7} />
      <CaptionTrack scene={scene} />
    </NapkinCanvas>
  );
};

export const FigureScene: React.FC<{ scene: Scene }> = ({ scene }) => (
  <NapkinCanvas>
    <Kicker text="The problem" accent={theme.accents[scene.accent]} />
    <EmotionFigure
      emotion={scene.emotion}
      action={scene.action ?? "idle"}
      accent={scene.accent}
      x={760}
      y={300}
      scale={1}
    />
    {/* a little hand-drawn ground line */}
    <RoughLayer>
      <RoughRect x={700} y={940} w={520} h={6} stroke={theme.inkSoft} seed={5} />
    </RoughLayer>
    <CaptionTrack scene={scene} />
  </NapkinCanvas>
);

export const EvidenceScene: React.FC<{ scene: Scene }> = ({ scene }) => (
  <NapkinCanvas vignette={false}>
    <Kicker text="The evidence" accent={theme.accents[scene.accent]} />
    <EvidenceZoom sourceId={scene.sourceId!} />
    {scene.emotion ? (
      <EmotionFigure emotion={scene.emotion} action="idle" accent={scene.accent} x={30} y={560} scale={0.5} />
    ) : null}
    <CaptionTrack scene={scene} />
  </NapkinCanvas>
);

export const ConstellationScene: React.FC<{ scene: Scene }> = ({ scene }) => (
  <NapkinCanvas>
    <Kicker text="The map of feeling" accent={theme.accents[scene.accent]} />
    <AbsoluteFill>
      <EmotionConstellation3D />
    </AbsoluteFill>
    <CaptionTrack scene={scene} />
  </NapkinCanvas>
);

export const WordCardsScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <NapkinCanvas>
      <Kicker text="Named elsewhere" accent={theme.accents[scene.accent]} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 36 }}>
        {(scene.words ?? []).map((w, i) => {
          const appear = spring({ frame: frame - (12 + i * 24), fps, config: { damping: 16 } });
          return (
            <div
              key={w.word}
              style={{
                width: 1200,
                background: "rgba(255,255,255,0.7)",
                borderLeft: `12px solid ${theme.accents[scene.accent]}`,
                borderRadius: 16,
                padding: "22px 34px",
                transform: `translateX(${(1 - appear) * -60}px)`,
                opacity: appear,
                boxShadow: "0 8px 0 rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ fontFamily: theme.fontTitle, fontSize: 70, color: theme.ink, lineHeight: 1 }}>
                {w.word} <span style={{ fontFamily: theme.fontBody, fontSize: 28, color: theme.inkSoft }}>· {w.lang}</span>
              </div>
              <div style={{ fontFamily: theme.fontBody, fontSize: 32, color: theme.ink, marginTop: 6 }}>{w.meaning}</div>
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
  const show = spring({ frame: frame - 30, fps, config: { damping: 14 } });
  return (
    <NapkinCanvas>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ fontFamily: theme.fontTitle, fontSize: 96, color: theme.ink, maxWidth: 1400 }}>
          You weren't broken.
          <br />
          You were under-worded.
        </div>
        <div
          style={{
            marginTop: 40,
            transform: `scale(${show * pulse})`,
            opacity: show,
            background: theme.accents.anger,
            color: "#fff",
            fontFamily: theme.fontBody,
            fontWeight: 900,
            fontSize: 48,
            padding: "18px 44px",
            borderRadius: 999,
          }}
        >
          ▶ Subscribe
        </div>
      </AbsoluteFill>
      <EmotionFigure emotion={scene.emotion} action="idle" accent={scene.accent} x={1420} y={360} scale={0.7} />
      <CaptionTrack scene={scene} />
    </NapkinCanvas>
  );
};

export const renderScene = (scene: Scene) => {
  switch (scene.type) {
    case "hook":
      return <HookScene scene={scene} />;
    case "figure":
      return <FigureScene scene={scene} />;
    case "evidence":
      return <EvidenceScene scene={scene} />;
    case "constellation3d":
      return <ConstellationScene scene={scene} />;
    case "wordcards":
      return <WordCardsScene scene={scene} />;
    case "outro":
      return <OutroScene scene={scene} />;
  }
};

// interpolate imported for potential scene transitions
void interpolate;
