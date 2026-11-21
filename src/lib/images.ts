import { staticFile } from "remotion";
import data from "../../assets/images.json";

export type ImageMeta = {
  id: string;
  q: string;
  file: string;
  title?: string | null;
  creator?: string | null;
  license: string;
  licenseVersion?: string | null;
  licenseUrl?: string | null;
  source?: string | null;
  landingUrl?: string | null;
  attribution?: string | null;
};

const map = data as unknown as Record<string, ImageMeta>;

export const hasImage = (id: string): boolean => Boolean(map[id] && map[id].file);
export const imagePath = (id: string): string => staticFile(`assets/img/${map[id].file}`);
export const imageMeta = (id: string): ImageMeta | undefined => map[id];
export const allImageMeta = (): ImageMeta[] => Object.values(map);

/** Short on-screen credit line (CC attribution). */
export const creditLine = (id: string): string => {
  const m = map[id];
  if (!m) return "";
  const who = m.creator || "Unknown";
  const lic = m.license + (m.licenseVersion ? ` ${m.licenseVersion}` : "");
  const src = m.source ? ` · ${m.source}` : "";
  return `${who} / ${lic}${src}`;
};
