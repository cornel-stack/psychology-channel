/**
 * Copies captured research screenshots from evidence/images -> public/evidence
 * so Remotion's staticFile() can serve them at render time. Runs automatically
 * before studio/render via npm pre-hooks.
 */
import { cpSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "evidence", "images");
const DST = join(ROOT, "public", "evidence");

mkdirSync(DST, { recursive: true });
if (existsSync(SRC)) {
  cpSync(SRC, DST, { recursive: true });
  const n = readdirSync(SRC).filter((f) => !f.startsWith(".")).length;
  console.log(`prep-assets: copied ${n} evidence image(s) -> public/evidence/`);
} else {
  console.log("prep-assets: no evidence/images yet (ok).");
}
