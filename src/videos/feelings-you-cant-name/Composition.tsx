import React from "react";
import { AbsoluteFill, Sequence, Series, useVideoConfig, Audio, staticFile } from "remotion";
import { SCENES } from "./script";
import { renderScene } from "./scenes";
import { theme } from "../../lib/theme";

/**
 * Main composition. Scenes play back-to-back via <Series>. Optional voiceover
 * and music are loaded from public/assets if present (the render works without
 * them — captions carry the video silently).
 */
export const FeelingsYouCantName: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: theme.paper }}>
      <Series>
        {SCENES.map((scene) => (
          <Series.Sequence key={scene.id} durationInFrames={Math.round(scene.durationSec * fps)}>
            {renderScene(scene)}
          </Series.Sequence>
        ))}
      </Series>

      {/* Optional audio — dropped in by the author; render is fine without. */}
      <OptionalAudio src="assets/voiceover.mp3" />
      <OptionalAudio src="assets/music.mp3" volume={0.12} />
    </AbsoluteFill>
  );
};

/** Renders an <Audio> only if the file exists; silently ignored otherwise. */
const OptionalAudio: React.FC<{ src: string; volume?: number }> = ({ src, volume = 1 }) => {
  const [ok, setOk] = React.useState(false);
  React.useEffect(() => {
    fetch(staticFile(src), { method: "HEAD" })
      .then((r) => setOk(r.ok))
      .catch(() => setOk(false));
  }, [src]);
  if (!ok) return null;
  return <Audio src={staticFile(src)} volume={volume} />;
};

// Sequence imported for authors extending the composition with overlays.
void Sequence;
