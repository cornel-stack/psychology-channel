/**
 * Auto-screenshotter for research sources (Rule #1).
 *
 * Opens each source URL in a headless browser and captures a full-page PNG
 * into evidence/images/<id>.png. These are the images the video zooms into.
 * After capturing, run `npm run verify-evidence` to hash + mark them verified.
 *
 * Why a real browser: scholarly pages (PMC, PubMed, publisher PDFs) need JS
 * and proper headers; a plain fetch gives you nothing usable to show.
 *
 * Notes:
 *   - Some publishers bot-gate or need a PDF viewer. If a capture looks wrong,
 *     take the screenshot manually and drop it in evidence/images/<id>.png —
 *     the verifier treats a hand-placed file identically.
 *   - Captures are intentionally NOT committed as "verified" automatically;
 *     the author reviews them, then the hash locks them in.
 *
 * Usage: npm run fetch-evidence [-- <id> <id> ...]   (omit ids to fetch all)
 */
import { readFileSync, writeFileSync, rmSync, existsSync, renameSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";

/** Download a PDF and render its first page to PNG via poppler's pdftoppm. */
async function capturePdf(url: string, out: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (evidence-fetch)" },
    });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    const tmpPdf = out.replace(/\.png$/, ".tmp.pdf");
    writeFileSync(tmpPdf, buf);
    // -singlefile writes exactly <prefix>.png (no page-number suffix), which
    // sidesteps poppler's zero-padding (-1 vs -01) across PDFs of different lengths.
    const prefix = out.replace(/\.png$/, "");
    execFileSync("pdftoppm", ["-png", "-r", "150", "-f", "1", "-l", "1", "-singlefile", tmpPdf, prefix]);
    rmSync(tmpPdf, { force: true });
    return existsSync(out);
  } catch {
    return false;
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCES = join(ROOT, "evidence", "sources.json");
const IMAGES = join(ROOT, "evidence", "images");

type Source = { id: string; url: string; image: string };

async function main() {
  const args = process.argv.slice(2);
  const FORCE = args.includes("--force");
  const only = args.filter((a) => !a.startsWith("--"));
  const db = JSON.parse(readFileSync(SOURCES, "utf8")) as { sources: Source[] };
  const targets = only.length ? db.sources.filter((s) => only.includes(s.id)) : db.sources;

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1400, height: 1800 },
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
  });

  for (const s of targets) {
    const out = join(IMAGES, s.image);

    // Skip already-captured images (they're committed + hash-verified). Re-fetch
    // only with --force or by naming the id explicitly. This keeps CI stable:
    // dynamic pages produce different bytes each capture, which would otherwise
    // trip the verifier's tamper-check (recorded sha256 mismatch).
    if (existsSync(out) && !FORCE && !only.includes(s.id)) {
      console.log(`skip ${s.id} (already captured; use --force to re-fetch)`);
      continue;
    }
    process.stdout.write(`Capturing ${s.id} ... `);

    // PDFs (direct links) can't be screenshotted in headless shell — download
    // and render page 1 with pdftoppm instead.
    if (/\.pdf($|\?)/i.test(s.url)) {
      const ok = await capturePdf(s.url, out);
      console.log(ok ? `ok (pdf→png) -> ${s.image}` : `FAILED (pdf). Capture manually into ${s.image}.`);
      continue;
    }

    const page = await ctx.newPage();
    try {
      await page.goto(s.url, { waitUntil: "networkidle", timeout: 45_000 });
      await page.waitForTimeout(2500);

      // Scholarly portals (PMC/PubMed) wrap the paper in site chrome. Clip to
      // the article body so the screenshot is the research, not the header.
      const articleSelectors = ["main .article", "main article", "#article-details", "main", "article"];
      let shot = false;
      if (/ncbi\.nlm\.nih\.gov/.test(s.url)) {
        for (const sel of articleSelectors) {
          const el = page.locator(sel).first();
          if ((await el.count()) > 0) {
            try {
              await el.screenshot({ path: out });
              shot = true;
              break;
            } catch {
              /* try next selector */
            }
          }
        }
      }
      if (!shot) await page.screenshot({ path: out, fullPage: true });
      console.log(`ok -> ${s.image}`);
    } catch (e) {
      console.log(`FAILED (${(e as Error).message}). Capture manually into ${s.image}.`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log("\nDone. Now run: npm run verify-evidence");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
