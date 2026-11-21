import React from "react";
import { AbsoluteFill, Sequence, Series, Audio, staticFile } from "remotion";
import { SCENES } from "./script";
import { renderScene } from "./scenes";
import { theme } from "../../lib/theme";

/**
 * Main composition. Scenes play back-to-back via <Series>, each scene's length
 * driven by its real Edge TTS (Brian) narration duration. The concatenated
 * voiceover.mp3 lines up frame-for-frame because each scene's frame count
 * matches its audio segment length.
 */
export const FeelingsYouCantName: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.paper }}>
      <Series>
        {SCENES.map((scene) => (
          <Series.Sequence key={scene.id} durationInFrames={scene.durationFrames}>
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
