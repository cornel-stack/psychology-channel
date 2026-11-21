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
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCES = join(ROOT, "evidence", "sources.json");
const IMAGES = join(ROOT, "evidence", "images");

type Source = { id: string; url: string; image: string };

async function main() {
  const only = process.argv.slice(2);
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
    process.stdout.write(`Capturing ${s.id} ... `);
    const page = await ctx.newPage();
    try {
      await page.goto(s.url, { waitUntil: "networkidle", timeout: 45_000 });
      await page.waitForTimeout(2500);
      await page.screenshot({ path: out, fullPage: true });
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
