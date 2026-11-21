/**
 * Open Peeps characters via DiceBear (the "code layer"), Rule #2.
 * Pablo Stanley's Open Peeps (CC0) rendered programmatically and deterministically
 * — same seed + face => identical SVG every frame, so CI renders are reproducible.
 *
 * `face` is the emotion dial (the mouth/eyes are baked into each face variant).
 */
import { createAvatar } from "@dicebear/core";
import { openPeeps } from "@dicebear/collection";
import type { Emotion } from "../videos/feelings-you-cant-name/script";

const cache = new Map<string, string>();

export const peepSvg = (seed: string, face: Emotion): string => {
  const key = `${seed}|${face}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const raw = createAvatar(openPeeps, {
    seed,
    face: [face],
    // clean, stable narrator: no random hats/masks/beards jumping around
    accessoriesProbability: 0,
    facialHairProbability: 0,
    maskProbability: 0,
    backgroundColor: ["transparent"],
    size: 512,
  }).toString();
  // make it fill its container box instead of a fixed 512px
  const svg = raw
    .replace(/\swidth="[^"]*"/, "")
    .replace(/\sheight="[^"]*"/, "")
    .replace("<svg", '<svg style="width:100%;height:100%;display:block" preserveAspectRatio="xMidYMid meet"');
  cache.set(key, svg);
  return svg;
};
