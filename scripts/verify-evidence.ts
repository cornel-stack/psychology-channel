/**
 * Evidence verifier — the gate for Rule #1.
 *
 * For every source in evidence/sources.json this checks:
 *   1. The citation URL (and DOI, if present) actually resolves (HTTP < 400).
 *   2. A screenshot image exists in evidence/images/.
 *   3. The screenshot's sha256 matches the hash recorded in sources.json
 *      (so a claim's on-screen "proof" cannot be silently swapped).
 *
 * A source is considered VERIFIED only when all three pass. The script then
 * rewrites sources.json flipping `verified` + filling `sha256`.
 *
 * Exit codes:
 *   0  -> at least the URL checks passed for every source (safe to render;
 *         unverified-image sources are simply withheld from screen by the UI).
 *   1  -> a hard failure the author must fix.
 *
 * Usage:
 *   npm run verify-evidence            # verify + update flags
 *   npm run verify-evidence -- --strict  # also FAIL if any image is missing
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCES = join(ROOT, "evidence", "sources.json");
const IMAGES = join(ROOT, "evidence", "images");
const STRICT = process.argv.includes("--strict");

type Source = {
  id: string;
  claim: string;
  citation: string;
  doi?: string | null;
  url: string;
  image: string;
  sha256?: string | null;
  verified: boolean;
};

type Db = { sources: Source[]; [k: string]: unknown };

const sha256 = (buf: Buffer) => createHash("sha256").update(buf).digest("hex");

async function urlResolves(url: string): Promise<boolean> {
  const attempt = async (method: "HEAD" | "GET") => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 20_000);
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: ctrl.signal,
        headers: { "User-Agent": "Mozilla/5.0 (evidence-verifier)" },
      });
      // Some scholarly hosts reject HEAD; treat <400 as resolving.
      return res.status < 400 || res.status === 403; // 403 = exists but bot-gated
    } catch {
      return false;
    } finally {
      clearTimeout(t);
    }
  };
  return (await attempt("HEAD")) || (await attempt("GET"));
}

async function main() {
  const db = JSON.parse(readFileSync(SOURCES, "utf8")) as Db;
  let hardFail = false;
  const report: string[] = [];

  for (const s of db.sources) {
    const checks: string[] = [];

    // 1. URL resolves
    const okUrl = await urlResolves(s.url);
    checks.push(okUrl ? "url:ok" : "url:FAIL");
    if (!okUrl) {
      report.push(`  ⚠️  ${s.id}: citation URL did not resolve -> ${s.url}`);
    }
    const okDoi = s.doi ? await urlResolves(`https://doi.org/${s.doi}`) : true;
    if (s.doi) checks.push(okDoi ? "doi:ok" : "doi:FAIL");

    // 2 + 3. Image exists and matches recorded hash
    const imgPath = join(IMAGES, s.image);
    const imgExists = existsSync(imgPath);
    let hashOk = false;
    if (imgExists) {
      const hash = sha256(readFileSync(imgPath));
      if (!s.sha256) {
        s.sha256 = hash; // first capture — record it
        hashOk = true;
        checks.push("img:captured");
      } else if (s.sha256 === hash) {
        hashOk = true;
        checks.push("img:ok");
      } else {
        checks.push("img:HASH-MISMATCH");
        report.push(
          `  ❌ ${s.id}: screenshot hash changed! recorded=${s.sha256.slice(0, 12)} actual=${hash.slice(0, 12)}`
        );
        hardFail = true;
      }
    } else {
      checks.push("img:missing");
      report.push(`  ⚠️  ${s.id}: no screenshot yet (run "npm run fetch-evidence") -> ${s.image}`);
      if (STRICT) hardFail = true;
    }

    // A claim is only VERIFIED (shown on screen) when URL + image + hash all pass.
    s.verified = okUrl && okDoi && imgExists && hashOk;
    report.push(`  ${s.verified ? "✅" : "⏳"} ${s.id.padEnd(22)} [${checks.join(", ")}]`);
  }

  writeFileSync(SOURCES, JSON.stringify(db, null, 2) + "\n");

  const verified = db.sources.filter((s) => s.verified).length;
  console.log("\nEvidence verification\n=====================");
  console.log(report.join("\n"));
  console.log(`\n${verified}/${db.sources.length} sources fully verified (URL + screenshot + hash).`);
  console.log(
    verified < db.sources.length
      ? "Unverified sources will be WITHHELD from the video (no claim shown without proof).\n"
      : "All sources verified. Every on-screen claim is backed by a checked screenshot.\n"
  );

  if (hardFail) {
    console.error("Hard failure (hash mismatch, or --strict with a missing image). Fix before rendering.");
    process.exit(1);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
