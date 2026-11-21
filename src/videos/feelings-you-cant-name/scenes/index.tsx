import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene } from "../script";
import { SHOTS, Shot } from "../shots";
import { theme } from "../../../lib/theme";
import { ImageShot } from "../../../components/ImageShot";
import { WordShot } from "../../../components/WordShot";
import { EvidenceZoom } from "../../../components/EvidenceZoom";
import { Three3D } from "../../../components/Three3D";

/** Split a scene's frames across its shots by weight (last shot takes remainder). */
const splitFrames = (shots: Shot[], total: number): number[] => {
  const weights = shots.map((s) => ("weight" in s && s.weight ? s.weight : 1));
  const sum = weights.reduce((a, b) => a + b, 0);
  const out: number[] = [];
  let acc = 0;
  shots.forEach((_, i) => {
    const f = i === shots.length - 1 ? total - acc : Math.max(1, Math.round((total * weights[i]) / sum));
    out.push(f);
    acc += f;
  });
  return out;
};

const ShotView: React.FC<{ shot: Shot; frames: number }> = ({ shot, frames }) => {
  let inner: React.ReactNode;
  switch (shot.kind) {
    case "image":
      inner = (
        <ImageShot
          id={shot.id}
          durationInFrames={frames}
          label={shot.label}
          sub={shot.sub}
          motion={shot.motion}
          full={shot.full}
        />
      );
      break;
    case "word":
      inner = <WordShot text={shot.text} sub={shot.sub} />;
      break;
    case "evidence":
      inner = <EvidenceZoom sourceId={shot.sourceId} zoomStart={Math.round(frames * 0.28)} zoomDur={Math.round(frames * 0.45)} />;
      break;
    case "three":
      inner = <Three3D variant={shot.variant} label={shot.label} />;
      break;
  }
  return <AbsoluteFill style={{ backgroundColor: theme.paper }}>{inner}</AbsoluteFill>;
};

export const SceneShots: React.FC<{ scene: Scene }> = ({ scene }) => {
  const shots = SHOTS[scene.id] ?? [{ kind: "word", text: scene.title ?? "" } as Shot];
  const frames = splitFrames(shots, scene.durationFrames);
  return (
    <Series>
      {shots.map((shot, i) => (
        <Series.Sequence key={i} durationInFrames={frames[i]}>
          <ShotView shot={shot} frames={frames[i]} />
        </Series.Sequence>
      ))}
    </Series>
  );
};

export const renderScene = (scene: Scene) => <SceneShots scene={scene} />;
