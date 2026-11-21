/**
 * Voiceover generator — Edge TTS, "Brian" (en-US-BrianNeural).
 *
 * For each scene it:
 *   1. synthesizes the narration to public/assets/vo/<id>.mp3 via edge-tts,
 *   2. measures the real duration with ffprobe,
 *   3. pads it to an exact whole-frame length (so audio lines up with the
 *      Series scene boundaries), and
 *   4. concatenates every padded scene into public/assets/voiceover.mp3.
 *
 * It also writes src/videos/feelings-you-cant-name/narration.json
 * ({ id: { audioSec, frames } }) which script.ts reads to set each scene's
 * length and re-sync the captions.
 *
 * Requires: python3 with `edge-tts` installed, and ffmpeg/ffprobe on PATH.
 *   python3 -m pip install --user --break-system-packages edge-tts
 *
 * Usage: npm run voiceover
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { SCENES } from "../src/videos/feelings-you-cant-name/script";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const VO_DIR = join(ROOT, "public", "assets", "vo");
const OUT = join(ROOT, "public", "assets", "voiceover.mp3");
const NARRATION_JSON = join(ROOT, "src", "videos", "feelings-you-cant-name", "narration.json");

const VOICE = "en-US-BrianNeural";
const RATE = "+6%"; // a touch brisker for retention
const FPS = 30;
const TAIL = 0.6; // seconds of breathing room after each line

const sh = (cmd: string, args: string[]) =>
  execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"] }).toString();

const probe = (file: string): number =>
  parseFloat(sh("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).trim());

function main() {
  if (existsSync(VO_DIR)) rmSync(VO_DIR, { recursive: true, force: true });
  mkdirSync(VO_DIR, { recursive: true });

  const narration: Record<string, { audioSec: number; frames: number }> = {};
  const paddedFiles: string[] = [];

  for (const scene of SCENES) {
    const rawMp3 = join(VO_DIR, `${scene.id}.mp3`);
    const txt = join(VO_DIR, `${scene.id}.txt`);
    writeFileSync(txt, scene.narration, "utf8");

    process.stdout.write(`🔊 ${scene.id} … `);
    sh("python3", ["-m", "edge_tts", "--voice", VOICE, "--rate", RATE, "--file", txt, "--write-media", rawMp3]);

    const audioSec = probe(rawMp3);
    // round the whole scene (audio + tail) up to a whole number of frames
    const frames = Math.ceil((audioSec + TAIL) * FPS);
    const exactSec = frames / FPS;
    narration[scene.id] = { audioSec: Number(audioSec.toFixed(3)), frames };

    // pad to the exact scene length so audio aligns with the video timeline
    const padded = join(VO_DIR, `${scene.id}.pad.mp3`);
    sh("ffmpeg", [
      "-y", "-i", rawMp3,
      "-af", `apad=pad_dur=${(exactSec - audioSec).toFixed(3)}`,
      "-t", exactSec.toFixed(3),
      "-ar", "48000", "-ac", "2",
      padded,
    ]);
    paddedFiles.push(padded);
    console.log(`${audioSec.toFixed(2)}s → ${frames} frames`);
  }

  // concat all padded scene clips into one voiceover track
  const listFile = join(VO_DIR, "concat.txt");
  writeFileSync(listFile, paddedFiles.map((f) => `file '${f}'`).join("\n"), "utf8");
  sh("ffmpeg", ["-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c:a", "libmp3lame", "-q:a", "3", OUT]);

  writeFileSync(NARRATION_JSON, JSON.stringify(narration, null, 2) + "\n");

  const total = Object.values(narration).reduce((a, n) => a + n.frames, 0) / FPS;
  console.log(`\n✅ Voiceover built: ${OUT}`);
  console.log(`   ${readdirSync(VO_DIR).filter((f) => f.endsWith(".pad.mp3")).length} scenes · ${total.toFixed(1)}s total`);
  console.log(`   Durations written to narration.json — scenes & captions now sync to Brian.`);
}

main();
