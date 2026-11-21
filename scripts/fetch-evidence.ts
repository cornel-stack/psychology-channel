/**
 * Accurate evidence capture (Rule #1, done right).
 *
 * For each source it produces evidence/images/<id>.png AND a `locator`
 * ({x,y,w,h} as 0–1 fractions of the image) that marks EXACTLY where the
 * supporting quote sits on the page. The video zooms to that rectangle and
 * highlights it — so we always point at the real sentence, never a guess.
 *
 *   sourceType "pdf" : download PDF, render the target page with pdftoppm,
 *                      find the quote's bounding box with `pdftotext -bbox`.
 *   sourceType "web" : open the page, locate the quote element in the DOM,
 *                      scroll it to center, screenshot the viewport, record its
 *                      client rect.
 *   sourceType "cite": no screenshot (paywalled) — a citation card is shown.
 *
 * Usage: npm run fetch-evidence [-- <id> ...] [--force]
 *   (no args skips already-captured images so CI stays stable.)
 */
import { readFileSync, writeFileSync, existsSync, rmSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCES = join(ROOT, "evidence", "sources.json");
const IMAGES = join(ROOT, "evidence", "images");

const DPI = 150;
type Rect = { x: number; y: number; w: number; h: number };
type Source = {
  id: string;
  sourceType: "pdf" | "web" | "cite";
  url: string;
  page?: number;
  quote: string;
  image: string | null;
  locator: Rect | null;
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9%]/g, "");

/** Render PDF page to PNG + find the quote rectangle via pdftotext -bbox. */
async function capturePdf(s: Source, out: string): Promise<Rect | null> {
  const res = await fetch(s.url, { redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 (evidence)" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const tmp = out.replace(/\.png$/, ".tmp.pdf");
  writeFileSync(tmp, Buffer.from(await res.arrayBuffer()));
  const page = s.page ?? 1;
  const prefix = out.replace(/\.png$/, "");
  execFileSync("pdftoppm", ["-png", "-r", String(DPI), "-f", String(page), "-l", String(page), "-singlefile", tmp, prefix]);

  // word boxes (in PDF points) for the same page
  const xml = execFileSync("pdftotext", ["-bbox", "-f", String(page), "-l", String(page), tmp, "-"]).toString();
  rmSync(tmp, { force: true });

  const pageM = xml.match(/<page width="([\d.]+)" height="([\d.]+)"/);
  if (!pageM) return null;
  const pw = parseFloat(pageM[1]);
  const ph = parseFloat(pageM[2]);

  const words: { t: string; x1: number; y1: number; x2: number; y2: number }[] = [];
  const re = /<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) {
    const t = norm(m[5]);
    if (t) words.push({ t, x1: +m[1], y1: +m[2], x2: +m[3], y2: +m[4] });
  }

  // locate the quote as a contiguous run of words
  const q = norm(s.quote);
  let joined = "";
  const starts: number[] = [];
  for (const w of words) {
    starts.push(joined.length);
    joined += w.t;
  }
  const at = joined.indexOf(q);
  if (at < 0) {
    console.log(`  (quote not found in page ${page} text — leaving locator null)`);
    return null;
  }
  const end = at + q.length;
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  for (let i = 0; i < words.length; i++) {
    const ws = starts[i];
    const we = ws + words[i].t.length;
    if (we > at && ws < end) {
      x1 = Math.min(x1, words[i].x1); y1 = Math.min(y1, words[i].y1);
      x2 = Math.max(x2, words[i].x2); y2 = Math.max(y2, words[i].y2);
    }
  }
  if (!isFinite(x1)) return null;
  return { x: x1 / pw, y: y1 / ph, w: (x2 - x1) / pw, h: (y2 - y1) / ph };
}

/** Screenshot a web page centered on the quote + record its client rect. */
async function captureWeb(s: Source, out: string): Promise<Rect | null> {
  const browser = await chromium.launch();
  const vw = 1400, vh = 1600;
  const ctx = await browser.newContext({
    viewport: { width: vw, height: vh },
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
  });
  const page = await ctx.newPage();
  try {
    await page.goto(s.url, { waitUntil: "networkidle", timeout: 45_000 });
    await page.waitForTimeout(2000);
    const loc = page.getByText(s.quote, { exact: false }).first();
    let rect: Rect | null = null;
    if (await loc.count()) {
      await loc.scrollIntoViewIfNeeded();
      // center it vertically so the zoom has room on all sides
      await loc.evaluate((el) => {
        const r = el.getBoundingClientRect();
        window.scrollBy(0, r.top - window.innerHeight / 2 + r.height / 2);
      });
      await page.waitForTimeout(500);
      const box = await loc.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height };
      });
      rect = { x: box.x / vw, y: box.y / vh, w: box.w / vw, h: box.h / vh };
    } else {
      console.log(`  (quote element not found on page — leaving locator null)`);
    }
    await page.screenshot({ path: out });
    return rect;
  } finally {
    await browser.close();
  }
}

async function main() {
  const args = process.argv.slice(2);
  const FORCE = args.includes("--force");
  const only = args.filter((a) => !a.startsWith("--"));
  mkdirSync(IMAGES, { recursive: true });
  const db = JSON.parse(readFileSync(SOURCES, "utf8")) as { sources: Source[] };
  const targets = only.length ? db.sources.filter((s) => only.includes(s.id)) : db.sources;

  for (const s of targets) {
    if (s.sourceType === "cite" || !s.image) {
      console.log(`· ${s.id}: citation-only (no screenshot)`);
      continue;
    }
    const out = join(IMAGES, s.image);
    if (existsSync(out) && !FORCE && !only.includes(s.id)) {
      console.log(`skip ${s.id} (already captured; --force to re-fetch)`);
      continue;
    }
    process.stdout.write(`Capturing ${s.id} (${s.sourceType}) ... `);
    try {
      const rect = s.sourceType === "pdf" ? await capturePdf(s, out) : await captureWeb(s, out);
      // persist the locator back into sources.json
      const full = JSON.parse(readFileSync(SOURCES, "utf8"));
      const tgt = full.sources.find((x: Source) => x.id === s.id);
      tgt.locator = rect;
      writeFileSync(SOURCES, JSON.stringify(full, null, 2) + "\n");
      console.log(rect ? `ok  locator=[${rect.x.toFixed(2)},${rect.y.toFixed(2)},${rect.w.toFixed(2)},${rect.h.toFixed(2)}]` : "ok (no locator)");
    } catch (e) {
      console.log(`FAILED (${(e as Error).message})`);
    }
  }
  console.log("\nNext: npm run verify-evidence");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
