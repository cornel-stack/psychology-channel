# 🧠 Evidence-Based Psychology Channel

Programmatic, evidence-backed psychology videos — written in code, rendered on **GitHub CI**, downloaded as MP4. No video editor required.

**First episode:** *Every Feeling You Can't Name, Explained (You've Had All of These)*

---

## How it works

| Requirement | How it's done |
|---|---|
| **1. Evidence-based, verified** | Every on-screen claim maps to a source in [`evidence/sources.json`](evidence/sources.json). A verifier checks each URL/DOI resolves and each screenshot exists + matches a recorded hash. **An unverified claim is never shown** — it renders an "evidence pending" card instead. The video zooms into the exact passage of each paper. |
| **2. Characters with emotions & actions** | Hand-drawn [`EmotionFigure`](src/components/EmotionFigure.tsx) (sad/joy/fear/anger/awe + sit/walk/idle). Upgrade paths wired up: **Lottie** ([`LottieEmotion`](src/components/LottieEmotion.tsx)) and **VRM + Mixamo** ([`VRMCharacter`](src/components/VRMCharacter.tsx), `@pixiv/three-vrm`). |
| **3. Hand-drawn look** | [`rough.js`](src/lib/rough.tsx) primitives (seeded for deterministic frames). |
| **4. Manim / Remotion** | Remotion is the orchestrator. Manim clips can be dropped into `public/assets/` and imported as `<Video>` (see below). |
| **5. 3D animation** | [`EmotionConstellation3D`](src/components/EmotionConstellation3D.tsx) via `three.js` + `@remotion/three` — the 27 emotions orbiting in 3D. |
| **6. Napkin / white canvas** | [`NapkinCanvas`](src/components/NapkinCanvas.tsx) warm-paper backdrop. |
| **7. YouTube assets** | Clickbait [`Thumbnail`](youtube/feelings-you-cant-name/Thumbnail.tsx) (A/B), [`description.md`](youtube/feelings-you-cant-name/description.md), [`metadata.json`](youtube/feelings-you-cant-name/metadata.json). |
| **8/9. Public repo + CI render** | [`.github/workflows/render.yml`](.github/workflows/render.yml) renders everything and uploads a downloadable MP4. |

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
- **Voiceover (optional):** drop `public/assets/voiceover.mp3` (and `music.mp3`). The video renders fine without them — captions carry it silent.

## 🎞️ Using Manim clips (Rule #4)
Render a Manim scene to `public/assets/<name>.mp4`, then in a scene component:
```tsx
import { Video, staticFile } from "remotion";
<Video src={staticFile("assets/my-manim-clip.mp4")} />
```

---

## Tech
Remotion · three.js (`@remotion/three`) · rough.js · `@remotion/lottie` · `@pixiv/three-vrm` · TypeScript. MIT licensed. See [`CREDITS.md`](CREDITS.md) for research + library attributions.
