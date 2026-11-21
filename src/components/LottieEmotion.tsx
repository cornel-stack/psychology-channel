/**
 * Lottie emotion overlay (Rule #2, secondary path). First-party frame-accurate
 * Remotion integration. Drop a free emotion JSON from LottieFiles into
 * public/assets/lottie/<name>.json and reference it by name.
 *
 * Gracefully renders nothing if the asset is missing, so CI never breaks.
 */
import React, { useEffect, useState } from "react";
import { Lottie, LottieAnimationData } from "@remotion/lottie";
import { continueRender, delayRender, staticFile, cancelRender } from "remotion";

export const LottieEmotion: React.FC<{
  name: string;
  style?: React.CSSProperties;
  loop?: boolean;
}> = ({ name, style, loop = true }) => {
  const [data, setData] = useState<LottieAnimationData | null>(null);
  const [handle] = useState(() => delayRender(`lottie-${name}`));

  useEffect(() => {
    fetch(staticFile(`assets/lottie/${name}.json`))
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("missing"))))
      .then((json) => {
        setData(json);
        continueRender(handle);
      })
      .catch(() => {
        // asset not present yet — skip quietly rather than failing the render
        continueRender(handle);
      });
  }, [handle, name]);

  if (!data) return null;
  return <Lottie animationData={data} loop={loop} style={style} />;
};

// cancelRender imported for parity with Remotion patterns; unused on the happy path.
void cancelRender;
