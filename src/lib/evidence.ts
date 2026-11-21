import { staticFile } from "remotion";
import sourcesData from "../../evidence/sources.json";

export type Rect = { x: number; y: number; w: number; h: number };

export type EvidenceSource = {
  id: string;
  claim: string;
  stat?: string;
  citation: string;
  doi?: string | null;
  sourceType: "pdf" | "web" | "cite";
  url: string;
  page?: number;
  quote: string;
  license?: string;
  openAccess?: boolean;
  image: string | null;
  locator: Rect | null;
  imgW?: number;
  imgH?: number;
  sha256?: string | null;
  verified: boolean;
};

const sources = (sourcesData as { sources: EvidenceSource[] }).sources;

export const getSource = (id: string): EvidenceSource => {
  const s = sources.find((x) => x.id === id);
  if (!s) throw new Error(`Evidence source "${id}" not found`);
  return s;
};

export const sourceImage = (id: string): string => {
  const s = getSource(id);
  if (!s.image) throw new Error(`Source "${id}" has no image`);
  return staticFile(`evidence/${s.image}`);
};

/** A paper screenshot may be shown only if verified AND it has a located quote. */
export const canZoom = (s: EvidenceSource): boolean =>
  s.verified && s.sourceType !== "cite" && !!s.image && !!s.locator;

export const allSources = sources;
