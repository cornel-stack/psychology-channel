import { staticFile } from "remotion";
import sourcesData from "../../evidence/sources.json";

export type EvidenceSource = {
  id: string;
  claim: string;
  headlineStat?: string;
  citation: string;
  doi?: string | null;
  url: string;
  interactiveMap?: string;
  license?: string;
  openAccess?: boolean;
  image: string;
  sha256?: string | null;
  zoom?: { x: number; y: number; scale: number };
  verified: boolean;
};

const sources = (sourcesData as { sources: EvidenceSource[] }).sources;

export const getSource = (id: string): EvidenceSource => {
  const s = sources.find((x) => x.id === id);
  if (!s) throw new Error(`Evidence source "${id}" not found in sources.json`);
  return s;
};

/**
 * Resolve the research screenshot for a source. Evidence images live under
 * public/evidence/ at render time (see the build step that copies them).
 */
export const sourceImage = (id: string): string =>
  staticFile(`evidence/${getSource(id).image}`);

/**
 * Rule #1 guard: a claim may only be shown if its source is verified.
 * Unverified sources render a visible "evidence pending" placeholder instead
 * of a fake screenshot — we never show an unverified claim as fact.
 */
export const isShowable = (id: string): boolean => getSource(id).verified;

export const allSources = sources;
