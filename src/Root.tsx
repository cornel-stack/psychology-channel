import React from "react";
import { Composition, Still } from "remotion";
import "./lib/fonts";
import { theme } from "./lib/theme";
import { FeelingsYouCantName } from "./videos/feelings-you-cant-name/Composition";
import { TOTAL_FRAMES } from "./videos/feelings-you-cant-name/script";
import { Thumbnail } from "../youtube/feelings-you-cant-name/Thumbnail";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FeelingsYouCantName"
        component={FeelingsYouCantName}
        durationInFrames={TOTAL_FRAMES}
        fps={theme.fps}
        width={theme.width}
        height={theme.height}
      />
      <Still
        id="FeelingsThumbnail"
        component={Thumbnail}
        width={1280}
        height={720}
        defaultProps={{ variant: "A" as const }}
      />
      <Still
        id="FeelingsThumbnailB"
        component={Thumbnail}
        width={1280}
        height={720}
        defaultProps={{ variant: "B" as const }}
      />
    </>
  );
};
