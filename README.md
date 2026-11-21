# 🧠 Evidence-Based Psychology Channel

Programmatic, evidence-backed psychology videos — written in code, rendered on **GitHub CI**, downloaded as MP4. No video editor required.

**First episode:** *Every Feeling You Can't Name, Explained (You've Had All of These)*

---

## How it works

| Requirement | How it's done |
|---|---|
| **1. Evidence-based, verified, accurate zoom** | Every claim maps to a source in [`evidence/sources.json`](evidence/sources.json) with the **exact verbatim quote**. [`fetch-evidence`](scripts/fetch-evidence.ts) locates that quote's pixel rectangle (PDF via `pdftotext -bbox`, web via DOM geometry) and stores a `locator`; the video zooms to **that exact sentence** and highlights it. [`verify-evidence`](scripts/verify-evidence.ts) gates the render on URL/DOI + screenshot hash + locator. Paywalled papers become honest citation cards. See [`evidence/CORRECTIONS.md`](evidence/CORRECTIONS.md). |
| **2. Characters with emotions** | **DiceBear Open Peeps** (`@dicebear/collection`, CC0) as emotion-driven characters — [`Peep`](src/components/Peep.tsx) swaps the `face` variant per beat, with deterministic bob + blink. **Coco Material** (CC0 hand-drawn SVGs) for "figure doing an activity" scenes — [`CocoArt`](src/components/CocoScene.tsx), prefetched by [`fetch-coco`](scripts/fetch-coco.ts). |
| **3. Hand-drawn look** | [`rough.js`](src/lib/rough.tsx) + the hand-drawn Open Peeps / Coco illustrations, on a warm paper canvas. |
| **4. Manim / Remotion** | Remotion is the orchestrator. Manim clips can be dropped into `public/assets/` and imported as `<Video>`. |
| **5. 3D** | Intentionally **not used** — a 3D gimmick didn't serve the content, so it was removed in favor of the character system above. |
| **6. Napkin / white canvas** | [`NapkinCanvas`](src/components/NapkinCanvas.tsx) warm-paper backdrop. |
| **7. YouTube assets** | Clickbait [`Thumbnail`](youtube/feelings-you-cant-name/Thumbnail.tsx) (A/B), [`description.md`](youtube/feelings-you-cant-name/description.md), [`metadata.json`](youtube/feelings-you-cant-name/metadata.json). |
| **8/9. Public repo + CI render** | [`.github/workflows/render.yml`](.github/workflows/render.yml) builds Coco assets + Brian voiceover, verifies evidence, renders, and uploads a downloadable MP4. Everything renders on CI. |

---

## 🚀 Get your first video (the only steps you need)

1. **Create a public GitHub repo** and push this folder:
   ```bash
   git add -A && git commit -m "feat: psychology channel + first video"
   gh repo create psychology-channel --public --source=. --push
   ```
2. Go to the repo's **Actions** tab → **Render video** → **Run workflow**.
3. When it finishes (~10–30 min), open the run and download the **`feelings-you-cant-name`** artifact. Inside: the MP4 + both thumbnails. **That's your video.**

> Rendering is 100% on GitHub's runners (Rule #9). You never render locally unless you want to preview.

---

## 🖥️ Optional: preview / edit locally

```bash
npm install
npm run dev          # opens Remotion Studio to scrub scenes live
npm run verify-evidence   # check sources + mark what's showable
npm run render       # render the MP4 locally into out/
```

## 📚 Adding / verifying evidence (Rule #1)

```bash
npm run fetch-evidence     # auto-screenshots every source URL (Playwright)
npm run verify-evidence    # URL resolves? image present? hash matches? -> marks `verified`
```
- Review the captured images in `evidence/images/`. If a publisher bot-blocks a capture, screenshot it by hand and drop it in as `<id>.png`.
- Only `verified: true` sources appear on screen. Edit zoom focus via each source's `zoom` field.

## ✍️ Editing the video

- **Script, timing, captions:** [`src/videos/feelings-you-cant-name/script.ts`](src/videos/feelings-you-cant-name/script.ts)
- **Scenes:** [`src/videos/feelings-you-cant-name/scenes/index.tsx`](src/videos/feelings-you-cant-name/scenes/index.tsx)
- **Voiceover:** narrated by **Edge TTS "Brian"** (`en-US-BrianNeural`), generated from each scene's `narration` field:
  ```bash
  python3 -m pip install --user edge-tts   # once
  npm run voiceover                         # synth Brian VO + auto-sync scene lengths & captions
  ```
  This writes `public/assets/voiceover.mp3` and `narration.json` (real per-scene durations). CI runs it automatically. Add `public/assets/music.mp3` for optional background music.

## 🎞️ Using Manim clips (Rule #4)
Render a Manim scene to `public/assets/<name>.mp4`, then in a scene component:
```tsx
import { Video, staticFile } from "remotion";
<Video src={staticFile("assets/my-manim-clip.mp4")} />
```

---

## Tech
Remotion · three.js (`@remotion/three`) · rough.js · `@remotion/lottie` · `@pixiv/three-vrm` · TypeScript. MIT licensed. See [`CREDITS.md`](CREDITS.md) for research + library attributions.
