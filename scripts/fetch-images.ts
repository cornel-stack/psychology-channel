/**
 * Fetch CC-licensed images from Openverse for every image shot (Rule: real
 * free-to-use media, properly attributed). Prefers CC0 / public-domain, falls
 * back to CC-BY / BY-SA. Saves to public/assets/img/<id>.<ext> and records full
 * license + attribution into assets/images.json (shown on screen + in the
 * YouTube description).
 *
 * Usage: npm run fetch-images [-- <id> ...] [--force]
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { IMAGE_SPECS } from "../src/videos/feelings-you-cant-name/shots";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const IMG_DIR = join(ROOT, "public", "assets", "img");
const META = join(ROOT, "assets", "images.json");
const API = "https://api.openverse.org/v1/images/";

type Meta = {
  id: string;
  q: string;
  file: string;
  title?: string;
  creator?: string;
  license: string;
  licenseVersion?: string;
  licenseUrl?: string;
  source?: string;
  landingUrl?: string;
  attribution?: string;
};

const extFromType = (ct: string) =>
  ct.includes("png") ? "png" : ct.includes("webp") ? "webp" : ct.includes("gif") ? "gif" : "jpg";

async function searchOne(q: string): Promise<any | null> {
  // try open licenses first (cc0, public domain mark), then permissive BY/BY-SA
  for (const license of ["cc0,pdm", "by,by-sa"]) {
    const url = `${API}?q=${encodeURIComponent(q)}&license=${license}&aspect_ratio=wide&size=medium,large&mature=false&page_size=8`;
    try {
      const res = await fetch(url, { headers: { "User-Agent": "psych-channel/1.0 (educational)" } });
      if (!res.ok) continue;
      const data = (await res.json()) as { results?: any[] };
      for (const r of data.results ?? []) {
        if (r.url) return r;
      }
    } catch {
      /* try next */
    }
  }
  return null;
}

async function download(url: string, base: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "psych-channel/1.0 (educational)" }, redirect: "follow" });
    if (!res.ok) return null;
    const ext = extFromType(res.headers.get("content-type") || "image/jpeg");
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 2000) return null; // junk/placeholder
    const file = `${base}.${ext}`;
    writeFileSync(join(IMG_DIR, file), buf);
    return file;
  } catch {
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const FORCE = args.includes("--force");
  const only = args.filter((a) => !a.startsWith("--"));
  mkdirSync(IMG_DIR, { recursive: true });
  mkdirSync(dirname(META), { recursive: true });

  const existing: Record<string, Meta> = existsSync(META) ? JSON.parse(readFileSync(META, "utf8")) : {};
  const targets = only.length ? IMAGE_SPECS.filter((s) => only.includes(s.id)) : IMAGE_SPECS;

  let ok = 0;
  for (const spec of targets) {
    if (existing[spec.id] && existing[spec.id].file && !FORCE && !only.includes(spec.id)) {
      ok++;
      continue;
    }
    process.stdout.write(`🖼  ${spec.id.padEnd(22)} "${spec.q}" … `);
    const hit = await searchOne(spec.q);
    if (!hit) {
      console.log("no CC result");
      continue;
    }
    const file = await download(hit.url, spec.id);
    if (!file) {
      console.log("download failed");
      continue;
    }
    existing[spec.id] = {
      id: spec.id,
      q: spec.q,
      file,
      title: hit.title,
      creator: hit.creator,
      license: (hit.license || "").toUpperCase(),
      licenseVersion: hit.license_version,
      licenseUrl: hit.license_url,
      source: hit.source,
      landingUrl: hit.foreign_landing_url,
      attribution: hit.attribution,
    };
    writeFileSync(META, JSON.stringify(existing, null, 2) + "\n");
    ok++;
    console.log(`ok [${existing[spec.id].license}] ${file}`);
  }

  console.log(`\n${ok}/${targets.length} images ready. Metadata -> assets/images.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
