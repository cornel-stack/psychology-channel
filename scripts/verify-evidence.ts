/**
 * Evidence verifier — the gate for Rule #1 (schema v2, locator-aware).
 *
 * A source is VERIFIED only when:
 *   - its citation URL (and DOI) resolves, AND
 *   - sourceType "cite": that's enough (paywalled → citation card only);
 *   - sourceType "pdf"/"web": a screenshot exists, its sha256 matches the
 *     recorded hash, AND a `locator` (the exact quote rectangle) is present.
 *
 * The locator requirement is what guarantees we zoom to the real sentence —
 * a screenshot with no located quote is NOT shown as proof.
 *
 * Usage: npm run verify-evidence [-- --strict]
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

type Rect = { x: number; y: number; w: number; h: number };
type Source = {
  id: string;
  sourceType: "pdf" | "web" | "cite";
  doi?: string | null;
  url: string;
  image: string | null;
  locator: Rect | null;
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
    const okUrl = await urlResolves(s.url);
    checks.push(okUrl ? "url:ok" : "url:FAIL");
    if (!okUrl) report.push(`  ⚠️  ${s.id}: URL did not resolve -> ${s.url}`);
    const okDoi = s.doi ? await urlResolves(`https://doi.org/${s.doi}`) : true;
    if (s.doi) checks.push(okDoi ? "doi:ok" : "doi:FAIL");

    if (s.sourceType === "cite") {
      s.verified = okUrl && okDoi;
      checks.push("cite");
      report.push(`  ${s.verified ? "✅" : "⏳"} ${s.id.padEnd(24)} [${checks.join(", ")}]`);
      continue;
    }

    // pdf/web need image + hash + locator
    const imgPath = s.image ? join(IMAGES, s.image) : "";
    const imgExists = Boolean(s.image) && existsSync(imgPath);
    let hashOk = false;
    if (imgExists) {
      const hash = sha256(readFileSync(imgPath));
      if (!s.sha256) {
        s.sha256 = hash;
        hashOk = true;
        checks.push("img:captured");
      } else if (s.sha256 === hash) {
        hashOk = true;
        checks.push("img:ok");
      } else {
        checks.push("img:HASH-MISMATCH");
        report.push(`  ❌ ${s.id}: screenshot hash changed (recapture reset: set sha256 null).`);
        hardFail = true;
      }
    } else {
      checks.push("img:missing");
      report.push(`  ⚠️  ${s.id}: no screenshot (run "npm run fetch-evidence")`);
      if (STRICT) hardFail = true;
    }

    const hasLocator = Boolean(s.locator);
    checks.push(hasLocator ? "locator:ok" : "locator:MISSING");
    if (!hasLocator) report.push(`  ⚠️  ${s.id}: no quote locator — claim will be withheld.`);

    s.verified = okUrl && okDoi && imgExists && hashOk && hasLocator;
    report.push(`  ${s.verified ? "✅" : "⏳"} ${s.id.padEnd(24)} [${checks.join(", ")}]`);
  }

  writeFileSync(SOURCES, JSON.stringify(db, null, 2) + "\n");

  const verified = db.sources.filter((s) => s.verified).length;
  console.log("\nEvidence verification (schema v2)\n=================================");
  console.log(report.join("\n"));
  console.log(`\n${verified}/${db.sources.length} sources verified.`);
  console.log(
    verified < db.sources.length
      ? "Unverified sources are WITHHELD from the video.\n"
      : "All sources verified — every on-screen claim points to a located quote.\n"
  );

  if (hardFail) {
    console.error("Hard failure. Fix before rendering.");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
